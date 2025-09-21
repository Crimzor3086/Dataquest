import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProfileForm from '@/components/profile/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  BookOpen, 
  Activity, 
  Award, 
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useProfile, useUserEnrollments, useUserActivity, useUserRole } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: enrollments, isLoading: enrollmentsLoading } = useUserEnrollments();
  const { data: activities, isLoading: activitiesLoading } = useUserActivity();
  const { data: userRole } = useUserRole();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-4">
                Please log in to view your profile.
              </p>
              <a
                href="/auth"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Go to Login
              </a>
            </CardContent>
          </Card>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and view your activity
            </p>
          </div>

          {/* Profile Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Role</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {userRole?.role ? (
                        <Badge variant="secondary" className="capitalize">
                          {userRole.role}
                        </Badge>
                      ) : (
                        'Student'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Courses</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {enrollmentsLoading ? '...' : enrollments?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Activities</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {activitiesLoading ? '...' : activities?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileLoading ? '...' : 
                        profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : 'Unknown'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="enrollments">Courses</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>

            {/* Enrollments Tab */}
            <TabsContent value="enrollments">
              <Card>
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>
                    View your enrolled courses and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {enrollmentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading courses...</span>
                    </div>
                  ) : enrollments && enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {enrollments.map((enrollment: any) => (
                        <div
                          key={enrollment.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {enrollment.courses?.title || 'Unknown Course'}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {enrollment.courses?.description || 'No description available'}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                                <span>Status: <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>{enrollment.status}</Badge></span>
                                <span>Progress: {enrollment.progress || 0}%</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {enrollment.courses?.price ? `KES ${enrollment.courses.price}` : 'Free'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
                      <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                      <a
                        href="/courses"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Browse Courses
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and system interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading activity...</span>
                    </div>
                  ) : activities && activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity: any) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3 p-4 border rounded-lg"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 capitalize">
                              {activity.activity_action.replace(/_/g, ' ')}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.activity_details}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                      <p className="text-gray-600">Your activity will appear here as you use the platform.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Account Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Email Address</p>
                          <p className="text-sm text-gray-600">{profile?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Phone Number</p>
                          <p className="text-sm text-gray-600">{profile?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Account Type</p>
                          <p className="text-sm text-gray-600">
                            {userRole?.role ? (
                              <Badge variant="secondary" className="capitalize">
                                {userRole.role}
                              </Badge>
                            ) : (
                              'Student'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div>
                    <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Profile;
