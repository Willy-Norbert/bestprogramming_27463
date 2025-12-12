import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/use-notification';
import { FormField } from '@/components/FormField';
import { User, Camera, Lock } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { showError, showSuccess, NotificationComponent } = useNotification();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Validation errors
  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
  }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(profileData.name);
    setProfileErrors({ name: nameError || undefined });

    if (nameError) {
      return;
    }

    setLoading(true);

    try {
      await apiClient.patch('/users/me', {
        name: profileData.name,
        avatarUrl: profileData.avatarUrl,
      });

      showSuccess('Profile Updated!', 'Your profile has been updated successfully.');
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentPassword = (value: string): string | null => {
    if (!value) {
      return 'Current password is required';
    }
    return null;
  };

  const validateNewPassword = (value: string): string | null => {
    if (!value) {
      return 'New password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const validateConfirmPassword = (value: string): string | null => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== passwordData.newPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentPasswordError = validateCurrentPassword(passwordData.currentPassword);
    const newPasswordError = validateNewPassword(passwordData.newPassword);
    const confirmPasswordError = validateConfirmPassword(passwordData.confirmPassword);

    const newErrors = {
      currentPassword: currentPasswordError || undefined,
      newPassword: newPasswordError || undefined,
      confirmPassword: confirmPasswordError || undefined,
    };

    setPasswordErrors(newErrors);

    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      return;
    }

    setLoading(true);

    try {
      await apiClient.patch('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      showSuccess('Password Changed!', 'Your password has been changed successfully.');

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and account settings
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-lg">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload a new profile picture
                  </p>
                </div>
              </div>

              <FormField
                label="Full Name"
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) => {
                  setProfileData({ ...profileData, name: e.target.value });
                  if (profileErrors.name) {
                    setProfileErrors({ name: validateName(e.target.value) || undefined });
                  }
                }}
                onBlur={() => setProfileErrors({ name: validateName(profileData.name) || undefined })}
                required
                error={profileErrors.name}
              />

              <FormField
                label="Avatar URL"
                id="avatarUrl"
                type="url"
                value={profileData.avatarUrl}
                onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />

              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-primary text-white hover:bg-brand-primary-dark"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <FormField
                label="Current Password"
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value });
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors({ ...passwordErrors, currentPassword: validateCurrentPassword(e.target.value) || undefined });
                  }
                }}
                onBlur={() => setPasswordErrors({ ...passwordErrors, currentPassword: validateCurrentPassword(passwordData.currentPassword) || undefined })}
                required
                error={passwordErrors.currentPassword}
              />

              <FormField
                label="New Password"
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value });
                  if (passwordErrors.newPassword) {
                    setPasswordErrors({ ...passwordErrors, newPassword: validateNewPassword(e.target.value) || undefined });
                  }
                  // Also validate confirm password if it has a value
                  if (passwordData.confirmPassword && passwordErrors.confirmPassword) {
                    setPasswordErrors({ ...passwordErrors, confirmPassword: validateConfirmPassword(passwordData.confirmPassword) || undefined });
                  }
                }}
                onBlur={() => setPasswordErrors({ ...passwordErrors, newPassword: validateNewPassword(passwordData.newPassword) || undefined })}
                required
                error={passwordErrors.newPassword}
              />
              {!passwordErrors.newPassword && (
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              )}

              <FormField
                label="Confirm New Password"
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors({ ...passwordErrors, confirmPassword: validateConfirmPassword(e.target.value) || undefined });
                  }
                }}
                onBlur={() => setPasswordErrors({ ...passwordErrors, confirmPassword: validateConfirmPassword(passwordData.confirmPassword) || undefined })}
                required
                error={passwordErrors.confirmPassword}
              />

              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-primary text-white hover:bg-brand-primary-dark"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {NotificationComponent}
    </DashboardLayout>
  );
};

export default Settings;

