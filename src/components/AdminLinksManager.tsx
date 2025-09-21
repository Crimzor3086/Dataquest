import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Folder, Settings, Users, BookOpen, TestTube, Shield } from 'lucide-react';

const AdminLinksManager = () => {
  const adminLinks = [
    {
      title: 'Blog Management',
      description: 'Create, edit, and manage blog posts',
      icon: FileText,
      path: '/admin/blog',
      color: 'bg-blue-600'
    },
    {
      title: 'Resource Management', 
      description: 'Manage downloadable resources and materials',
      icon: Folder,
      path: '/admin/resources',
      color: 'bg-green-600'
    },
    {
      title: 'Course Management',
      description: 'Create and manage courses and curriculum',
      icon: BookOpen,
      path: '/admin/courses',
      color: 'bg-purple-600'
    },
    {
      title: 'Student Management',
      description: 'View and manage student enrollments',
      icon: Users,
      path: '/admin/students',
      color: 'bg-orange-600'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-gray-600'
    },
    {
      title: 'Payment Dashboard',
      description: 'Manage payments, testing, and audits',
      icon: TestTube,
      path: '/admin/payments',
      color: 'bg-blue-600'
    }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Admin Management Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path}>
                <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{link.title}</h3>
                        <p className="text-gray-400 text-xs">{link.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLinksManager;