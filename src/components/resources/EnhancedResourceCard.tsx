import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Video, Image, Archive, Eye, Star, User, Calendar } from 'lucide-react';
import { Resource } from '@/hooks/useResourceManagement';

interface EnhancedResourceCardProps {
  resource: Resource;
  onPreview: (resource: Resource) => void;
  onDownload: (resource: Resource) => void;
}

const EnhancedResourceCard: React.FC<EnhancedResourceCardProps> = ({ 
  resource, 
  onPreview, 
  onDownload 
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      case 'image': return <Image className="w-6 h-6" />;
      case 'archive': return <Archive className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getDifficultyColor = (level: string | null) => {
    switch (level) {
      case 'beginner': return 'bg-green-600/20 text-green-400 border-green-400';
      case 'intermediate': return 'bg-yellow-600/20 text-yellow-400 border-yellow-400';
      case 'advanced': return 'bg-red-600/20 text-red-400 border-red-400';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-400';
    }
  };

  const formatFileSize = (sizeMb: number | null) => {
    if (!sizeMb) return '';
    if (sizeMb < 1) return `${(sizeMb * 1024).toFixed(0)} KB`;
    return `${sizeMb.toFixed(1)} MB`;
  };

  const authorName = resource.profiles 
    ? `${resource.profiles.first_name} ${resource.profiles.last_name}`.trim()
    : 'DataQuest Team';

  return (
    <Card className={`bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300 ${resource.featured ? 'ring-2 ring-yellow-400' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="text-blue-400">
            {getIcon(resource.type)}
          </div>
          <div className="flex items-center space-x-2">
            {resource.featured && (
              <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-400">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge className={resource.is_free ? "bg-blue-600/20 text-blue-400 border-blue-400" : "bg-purple-600/20 text-purple-400 border-purple-400"}>
              {resource.is_free ? 'Free' : 'Premium'}
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-400 capitalize">
              {resource.type}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-white text-lg mb-2 line-clamp-2">{resource.title}</CardTitle>
        
        {resource.resource_categories && (
          <Badge 
            variant="outline" 
            className="border-blue-500 text-blue-300 w-fit"
          >
            {resource.resource_categories.name}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <p className="text-blue-100 text-sm mb-4 line-clamp-3">{resource.description}</p>
        
        {/* Metadata */}
        <div className="space-y-2 mb-4">
          {resource.difficulty_level && (
            <div className="flex items-center justify-between">
              <span className="text-blue-300 text-xs">Difficulty:</span>
              <Badge className={getDifficultyColor(resource.difficulty_level)}>
                {resource.difficulty_level}
              </Badge>
            </div>
          )}
          
          {resource.file_size_mb && (
            <div className="flex items-center justify-between">
              <span className="text-blue-300 text-xs">File Size:</span>
              <span className="text-blue-200 text-xs">{formatFileSize(resource.file_size_mb)}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-blue-300 text-xs">Author:</span>
            <span className="text-blue-200 text-xs">{authorName}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs text-blue-300">
            <Download className="w-3 h-3" />
            <span>{resource.download_count} downloads</span>
          </div>
          <div className="text-xs text-blue-300">
            {new Date(resource.created_at).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {resource.preview_url && (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              onClick={() => onPreview(resource)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          <Button 
            size="sm" 
            className={`${resource.preview_url ? 'flex-1' : 'w-full'} bg-blue-600 hover:bg-blue-700 text-white`}
            onClick={() => onDownload(resource)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedResourceCard;