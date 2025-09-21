import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      await uploadAvatar.mutateAsync(file);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateProfile.mutateAsync({ avatar_url: null });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Profile not found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage your personal information and profile settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url || undefined} alt="Profile" />
              <AvatarFallback className="text-lg">
                {profile.first_name?.charAt(0) || profile.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-colors"
              disabled={uploadAvatar.isPending}
              title="Upload new avatar"
              aria-label="Upload new avatar"
            >
              <Camera className="w-3 h-3" />
            </button>
            {profile.avatar_url && (
              <button
                onClick={handleRemoveAvatar}
                className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-colors"
                disabled={updateProfile.isPending}
                title="Remove avatar"
                aria-label="Remove avatar"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {profile.first_name && profile.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : profile.email || 'User'
              }
            </h3>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="mt-2"
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploadAvatar.isPending ? 'Uploading...' : 'Change Avatar'}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
          aria-label="Avatar file input"
        />

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={profile.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Email cannot be changed. Contact support if you need to update your email.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      first_name: profile.first_name || '',
                      last_name: profile.last_name || '',
                      phone: profile.phone || '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>

        {/* Profile Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Member since:</span>
              <p className="font-medium">
                {profile.created_at 
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'Unknown'
                }
              </p>
            </div>
            <div>
              <span className="text-gray-500">Last updated:</span>
              <p className="font-medium">
                {profile.updated_at 
                  ? new Date(profile.updated_at).toLocaleDateString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
