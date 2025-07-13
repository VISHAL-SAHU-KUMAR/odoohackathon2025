import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors for the field being edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        fullName: formData.fullName
      });
      
      if (result?.success) {
        // Show success message and redirect
        navigate('/authentication/verify-email', { 
          state: { email: formData.email } 
        });
      }
    } catch (error) {
      console.log('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      // OAuth implementation would go here
      console.log('Google signup not implemented yet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">NestDocker</h1>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Create your account</h2>
          <p className="text-muted-foreground">Start your secure file storage journey</p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={20} />
              <span className="font-medium">Sign up failed</span>
            </div>
            <p className="text-sm text-error/80 mt-1">{authError}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                Full name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full"
                error={validationErrors.fullName}
              />
              {validationErrors.fullName && (
                <p className="text-sm text-error mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full"
                error={validationErrors.email}
              />
              {validationErrors.email && (
                <p className="text-sm text-error mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pr-10"
                  error={validationErrors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-error mt-1">{validationErrors.password}</p>
              )}
              <div className="mt-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li className={formData.password.length >= 8 ? 'text-success' : ''}>
                      At least 8 characters
                    </li>
                    <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-success' : ''}>
                      One lowercase letter
                    </li>
                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-success' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/(?=.*\d)/.test(formData.password) ? 'text-success' : ''}>
                      One number
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pr-10"
                  error={validationErrors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-error mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 mt-0.5"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              iconName={isLoading ? "Loader2" : "UserPlus"}
              iconPosition="left"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Social Signup */}
        <Button
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full"
          iconName="Chrome"
          iconPosition="left"
        >
          Continue with Google
        </Button>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            to="/authentication/login"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign in
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={16} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Your Privacy Matters</h4>
              <p className="text-xs text-muted-foreground">
                All files are encrypted on your device before upload. We use zero-knowledge architecture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;