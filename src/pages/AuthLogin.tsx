import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/FormField';
import { useNotification } from '@/hooks/use-notification';
import { SEOHead } from '@/components/SEOHead';
import { LogoWatermark } from '@/components/LogoWatermark';
import { SchoolTexture } from '@/components/SchoolTexture';
import { Logo } from '@/components/Logo';

const AuthLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showError, showSuccess, NotificationComponent } = useNotification();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateUsername = (value: string): string | null => {
    if (!value.trim()) {
      return 'Username is required';
    }
    return null;
  };

  const validatePassword = (value: string): string | null => {
    if (!value) {
      return 'Password is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    const newErrors = {
      username: usernameError || undefined,
      password: passwordError || undefined,
    };

    setErrors(newErrors);

    if (usernameError || passwordError) {
      return;
    }

    setLoading(true);

    try {
      await login(username, password, rememberMe);
      showSuccess(
        'Login Successful!',
        'You have been logged in successfully. Redirecting to your dashboard...',
        {
          primary: {
            label: 'Go to Dashboard',
            onClick: () => navigate(from, { replace: true }),
          },
        }
      );
    } catch (error: any) {
      // Handle network/connection errors
      if (!error.response) {
        showError(
          'Connection Error',
          'Unable to connect to the server. Please check your internet connection and try again.',
        );
        return;
      }

      // Handle authentication errors
      const errorMessage = error.response?.data?.message || 'Failed to login. Please check your credentials.';
      showError(
        'Login Failed',
        errorMessage,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <SchoolTexture />
      <LogoWatermark />
      
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <SEOHead
            title="Sign In - E-shuri"
            description="Sign in to your E-shuri account to manage your classroom bookings"
          />
          
          <div className="flex justify-center mb-4">
            <Logo showText={false} size="lg" />
          </div>
          
          <div>
            <h2 className="text-4xl font-normal text-foreground tracking-[-0.02em]">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your bookings and resources
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Username"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors({ ...errors, username: validateUsername(e.target.value) || undefined });
                }
              }}
              onBlur={() => setErrors({ ...errors, username: validateUsername(username) || undefined })}
              required
              disabled={loading}
              error={errors.username}
            />

            <FormField
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: validatePassword(e.target.value) || undefined });
                }
              }}
              onBlur={() => setErrors({ ...errors, password: validatePassword(password) || undefined })}
              required
              disabled={loading}
              error={errors.password}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-brand-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/auth/register" className="text-brand-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-muted overflow-hidden">
        <img
          src="/hero.png"
          alt="African Classroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-primary/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Welcome Back</h3>
            <p className="text-white/90 drop-shadow-md">
              Access your classroom bookings and manage resources efficiently
            </p>
          </div>
        </div>
      </div>
      {NotificationComponent}
    </div>
  );
};

export default AuthLogin;

