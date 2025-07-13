import { supabase } from './supabaseClient';

const fileService = {
  // Get all files for the current user
  async getUserFiles(userId, options = {}) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        sortBy = 'created_at', 
        sortOrder = 'desc',
        folderPath = null,
        search = '',
        fileType = null
      } = options;

      let query = supabase
        .from('files')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'uploaded');

      // Add folder filter if specified
      if (folderPath !== null) {
        query = query.eq('folder_path', folderPath);
      }

      // Add search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,original_name.ilike.%${search}%`);
      }

      // Add file type filter
      if (fileType) {
        query = query.eq('file_type', fileType);
      }

      // Add sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Add pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data, count };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      throw error;
    }
  },

  // Create a new file record
  async createFile(userId, fileData) {
    try {
      const { data, error } = await supabase
        .from('files')
        .insert({
          user_id: userId,
          name: fileData.name,
          original_name: fileData.originalName,
          file_type: fileData.fileType,
          file_size: fileData.fileSize,
          mime_type: fileData.mimeType,
          ipfs_hash: fileData.ipfsHash,
          encrypted_key: fileData.encryptedKey,
          file_hash: fileData.fileHash,
          status: fileData.status || 'uploading',
          folder_path: fileData.folderPath || '/',
          thumbnail_url: fileData.thumbnailUrl,
          metadata: fileData.metadata || {}
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please try again.' 
        };
      }
      throw error;
    }
  },

  // Update file status or metadata
  async updateFile(fileId, updates) {
    try {
      const { data, error } = await supabase
        .from('files')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please try again.' 
        };
      }
      throw error;
    }
  },

  // Delete a file
  async deleteFile(fileId) {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please try again.' 
        };
      }
      throw error;
    }
  },

  // Get user storage stats
  async getStorageStats(userId) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('storage_quota_bytes, storage_used_bytes')
        .eq('id', userId)
        .single();

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      const { data: fileStats, error: statsError } = await supabase
        .from('files')
        .select('file_type, file_size')
        .eq('user_id', userId)
        .eq('status', 'uploaded');

      if (statsError) {
        return { success: false, error: statsError.message };
      }

      // Calculate type breakdown
      const typeBreakdown = fileStats?.reduce((acc, file) => {
        const type = file.file_type;
        if (!acc[type]) {
          acc[type] = { count: 0, size: 0 };
        }
        acc[type].count++;
        acc[type].size += file.file_size;
        return acc;
      }, {}) || {};

      return { 
        success: true, 
        data: {
          quotaBytes: profile.storage_quota_bytes,
          usedBytes: profile.storage_used_bytes,
          availableBytes: profile.storage_quota_bytes - profile.storage_used_bytes,
          totalFiles: fileStats?.length || 0,
          typeBreakdown
        }
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please try again.' 
        };
      }
      throw error;
    }
  },

  // Get file by ID
  async getFileById(fileId) {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please try again.' 
        };
      }
      throw error;
    }
  },

  // Toggle file favorite status
  async toggleFavorite(fileId, isFavorite) {
    try {
      const { data, error } = await supabase
        .from('files')
        .update({ 
          is_favorite: isFavorite,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Please try again.' 
        };
      }
      throw error;
    }
  }
};

export default fileService;