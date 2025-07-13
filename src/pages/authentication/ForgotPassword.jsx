import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await resetPassword(email);
      
      if (result?.success) {
        setIsEmailSent(true);
      } else {
        setError(result?.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Mail" size={32} className="text-success" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Check your email</h2>
            <p className="text-muted-foreground">
              We have sent password reset instructions to{' '}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Did not receive the email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                className="text-primary hover:text-primary/80 font-medium"
              >
                try again
              </button>
            </p>

            <Link to="/authentication/login">
              <Button variant="outline" className="w-full" iconName="ArrowLeft" iconPosition="left">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-semibold text-foreground mb-2">Reset your password</h2>
          <p className="text-muted-foreground">
            Enter your email address and we will send you instructions to reset your password.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={20} />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-error/80 mt-1">{error}</p>
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full"
            iconName={isLoading ? "Loader2" : "Mail"}
            iconPosition="left"
          >
            {isLoading ? 'Sending...' : 'Send reset instructions'}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/authentication/login"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={16} />
            <span>Back to login</span>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Security Notice</h4>
              <p className="text-xs text-muted-foreground">
                For security reasons, we do not reveal whether an email address is registered in our system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;