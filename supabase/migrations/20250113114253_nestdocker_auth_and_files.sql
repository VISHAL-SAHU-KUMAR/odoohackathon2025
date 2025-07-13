-- NestDocker Authentication and File Management Schema
-- Location: supabase/migrations/20250113114253_nestdocker_auth_and_files.sql

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.file_status AS ENUM ('uploading', 'uploaded', 'failed', 'deleted');
CREATE TYPE public.share_access_type AS ENUM ('view', 'download', 'edit');

-- 2. User profiles table (intermediary for auth relationships)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    avatar_url TEXT,
    storage_quota_bytes BIGINT DEFAULT 5368709120, -- 5GB default
    storage_used_bytes BIGINT DEFAULT 0,
    encryption_key_salt TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Files table for metadata storage
CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT,
    ipfs_hash TEXT UNIQUE,
    encrypted_key TEXT NOT NULL, -- AES key encrypted with user's master key
    file_hash TEXT, -- Hash of original file for integrity
    status public.file_status DEFAULT 'uploading'::public.file_status,
    is_favorite BOOLEAN DEFAULT false,
    folder_path TEXT DEFAULT '/',
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Folders table for organization
CREATE TABLE public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Shared links table
CREATE TABLE public.shared_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    link_token TEXT UNIQUE NOT NULL,
    access_type public.share_access_type DEFAULT 'view'::public.share_access_type,
    is_password_protected BOOLEAN DEFAULT false,
    password_hash TEXT,
    is_otp_protected BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    max_downloads INTEGER,
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    accessed_at TIMESTAMPTZ
);

-- 6. Activity logs table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    file_id UUID REFERENCES public.files(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_files_user_id ON public.files(user_id);
CREATE INDEX idx_files_ipfs_hash ON public.files(ipfs_hash);
CREATE INDEX idx_files_status ON public.files(status);
CREATE INDEX idx_files_folder_path ON public.files(folder_path);
CREATE INDEX idx_folders_user_id ON public.folders(user_id);
CREATE INDEX idx_folders_parent_id ON public.folders(parent_id);
CREATE INDEX idx_shared_links_file_id ON public.shared_links(file_id);
CREATE INDEX idx_shared_links_token ON public.shared_links(link_token);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_file_id ON public.activity_logs(file_id);

-- 8. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 9. Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.is_file_owner(file_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.files f
    WHERE f.id = file_uuid AND f.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.is_folder_owner(folder_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.folders fo
    WHERE fo.id = folder_uuid AND fo.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_shared_link(link_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.shared_links sl
    WHERE sl.id = link_uuid AND (
        sl.user_id = auth.uid() OR 
        (sl.is_active = true AND (sl.expires_at IS NULL OR sl.expires_at > NOW()))
    )
)
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

-- 10. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles 
FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_manage_own_files" ON public.files 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_manage_own_folders" ON public.folders 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_manage_own_shared_links" ON public.shared_links 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "public_access_valid_shared_links" ON public.shared_links 
FOR SELECT TO public USING (public.can_access_shared_link(id));

CREATE POLICY "users_view_own_activity" ON public.activity_logs 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "admins_view_all_activity" ON public.activity_logs 
FOR SELECT USING (public.has_admin_role());

-- 11. Functions for automatic profile creation and updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Helper functions for application logic
CREATE OR REPLACE FUNCTION public.log_activity(
    p_user_id UUID,
    p_file_id UUID,
    p_action TEXT,
    p_details JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.activity_logs (user_id, file_id, action, details, ip_address, user_agent)
    VALUES (p_user_id, p_file_id, p_action, p_details, p_ip_address, p_user_agent)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_storage_usage(p_user_id UUID, p_size_change BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.user_profiles
    SET storage_used_bytes = GREATEST(0, storage_used_bytes + p_size_change)
    WHERE id = p_user_id;
END;
$$;

-- 14. Mock data for development
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    demo_file_id UUID := gen_random_uuid();
    demo_folder_id UUID := gen_random_uuid();
BEGIN
    -- Create demo auth users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@nestdocker.com', crypt('admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@nestdocker.com', crypt('user123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create demo folder
    INSERT INTO public.folders (id, user_id, name, path) VALUES
        (demo_folder_id, user_uuid, 'Documents', '/Documents');

    -- Create demo files
    INSERT INTO public.files (id, user_id, name, original_name, file_type, file_size, mime_type, ipfs_hash, encrypted_key, file_hash, status, folder_path) VALUES
        (demo_file_id, user_uuid, 'welcome_guide.pdf', 'Welcome to NestDocker.pdf', 'pdf', 2048576, 'application/pdf', 'QmX7Y8Z9DemoHash1', 'encrypted_key_demo_1', 'sha256_demo_hash_1', 'uploaded'::public.file_status, '/Documents'),
        (gen_random_uuid(), user_uuid, 'team_photo.jpg', 'Team Photo 2024.jpg', 'image', 5242880, 'image/jpeg', 'QmA1B2C3DemoHash2', 'encrypted_key_demo_2', 'sha256_demo_hash_2', 'uploaded'::public.file_status, '/'),
        (gen_random_uuid(), user_uuid, 'presentation.pptx', 'Project Presentation.pptx', 'presentation', 15728640, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'QmD4E5F6DemoHash3', 'encrypted_key_demo_3', 'sha256_demo_hash_3', 'uploaded'::public.file_status, '/');

    -- Create demo shared link
    INSERT INTO public.shared_links (file_id, user_id, link_token, access_type, expires_at) VALUES
        (demo_file_id, user_uuid, 'demo_share_token_123', 'view'::public.share_access_type, NOW() + INTERVAL '7 days');

    -- Log demo activity
    INSERT INTO public.activity_logs (user_id, file_id, action, details) VALUES
        (user_uuid, demo_file_id, 'file_uploaded', '{"file_name": "welcome_guide.pdf", "file_size": 2048576}'::jsonb),
        (user_uuid, demo_file_id, 'file_shared', '{"share_type": "link", "access_type": "view"}'::jsonb);

    -- Update storage usage
    UPDATE public.user_profiles 
    SET storage_used_bytes = 23019296 -- Sum of demo file sizes
    WHERE id = user_uuid;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during demo data creation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during demo data creation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during demo data creation: %', SQLERRM;
END $$;