import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/components/FormField';
import { useNotification } from '@/hooks/use-notification';
import { SEOHead } from '@/components/SEOHead';
import { LogoWatermark } from '@/components/LogoWatermark';
import { SchoolTexture } from '@/components/SchoolTexture';
import { Logo } from '@/components/Logo';

const AuthRegister = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showError, showSuccess, NotificationComponent } = useNotification();

  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  };

  const validateUsername = (value: string): string | null => {
    if (!value.trim()) {
      return 'Username is required';
    }
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-z0-9_]+$/.test(value)) {
      return 'Username can only contain lowercase letters, numbers, and underscores';
    }
    return null;
  };

  const validatePassword = (pwd: string): string | null => {
    if (!pwd) {
      return 'Password is required';
    }
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const validateConfirmPassword = (value: string): string | null => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(name);
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    const newErrors = {
      name: nameError || undefined,
      username: usernameError || undefined,
      password: passwordError || undefined,
      confirmPassword: confirmPasswordError || undefined,
    };

    setErrors(newErrors);

    // If there are validation errors, don't submit
    if (nameError || usernameError || passwordError || confirmPasswordError) {
      return;
    }

    setLoading(true);

    try {
      await register(name, username, password, role);
      showSuccess(
        'Account Created!',
        'Your account has been created successfully. You can now start booking resources.',
        {
          primary: {
            label: 'Go to Dashboard',
            onClick: () => navigate('/dashboard', { replace: true }),
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

      // Handle validation errors from server
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const serverErrors: any = {};
        error.response.data.errors.forEach((err: any) => {
          const field = err.param || err.field;
          if (field === 'name') serverErrors.name = err.msg || err.message;
          if (field === 'username') serverErrors.username = err.msg || err.message;
          if (field === 'password') serverErrors.password = err.msg || err.message;
        });
        setErrors(serverErrors);
        showError(
          'Validation Error',
          'Please check the form fields and correct the errors.',
        );
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create account. Please try again.';
        showError(
          'Registration Failed',
          errorMessage,
        );
      }
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
            title="Sign Up - E-shuri"
            description="Create your E-shuri account to start booking classrooms and resources"
          />
          
          <div className="flex justify-center mb-4">
            <Logo showText={false} size="lg" />
          </div>
          
          <div>
            <h2 className="text-4xl font-normal text-foreground tracking-[-0.02em]">
              Sign Up
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create an account to start booking resources
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Full Name"
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors({ ...errors, name: validateName(e.target.value) || undefined });
                }
              }}
              onBlur={() => setErrors({ ...errors, name: validateName(name) || undefined })}
              required
              disabled={loading}
              error={errors.name}
            />

            <FormField
              label="Username"
              id="username"
              type="text"
              placeholder="Choose a username (lowercase, numbers, underscores only)"
              value={username}
              onChange={(e) => {
                // Convert to lowercase and filter invalid characters
                const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                setUsername(value);
                if (errors.username) {
                  setErrors({ ...errors, username: validateUsername(value) || undefined });
                }
              }}
              onBlur={() => setErrors({ ...errors, username: validateUsername(username) || undefined })}
              required
              disabled={loading}
              error={errors.username}
            />

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="staff">Staff (Teacher)</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              label="Password"
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: validatePassword(e.target.value) || undefined });
                }
                // Also validate confirm password if it has a value
                if (confirmPassword && errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: validateConfirmPassword(confirmPassword) || undefined });
                }
              }}
              onBlur={() => setErrors({ ...errors, password: validatePassword(password) || undefined })}
              required
              disabled={loading}
              error={errors.password}
            />

            <FormField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: validateConfirmPassword(e.target.value) || undefined });
                }
              }}
              onBlur={() => setErrors({ ...errors, confirmPassword: validateConfirmPassword(confirmPassword) || undefined })}
              required
              disabled={loading}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/auth/login" className="text-brand-primary hover:underline font-medium">
              Sign in
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
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Join E-shuri</h3>
            <p className="text-white/90 drop-shadow-md">
              Start managing your classroom bookings and resources today
            </p>
          </div>
        </div>
      </div>
      {NotificationComponent}
    </div>
  );
};

export default AuthRegister;

