
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Video, Book, Wrench, Eye } from 'lucide-react';

interface ResourceCardProps {
  resource: {
    id: number;
    title: string;
    description: string;
    type: string;
    downloads: number;
    isFree: boolean;
    downloadUrl: string;
    hasPreview?: boolean;
  };
  onPreview: (resource: any) => void;
  onDownload: (resource: any) => void;
}

const ResourceCard = ({ resource, onPreview, onDownload }: ResourceCardProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      case 'guide': return <Book className="w-6 h-6" />;
      case 'template': return <Wrench className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <Card className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-blue-400">
            {getIcon(resource.type)}
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={resource.isFree ? "bg-blue-600/20 text-blue-400 border-blue-400" : "bg-yellow-600/20 text-yellow-400 border-yellow-400"}>
              {resource.isFree ? 'Free' : 'Premium'}
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-400 capitalize">
              {resource.type}
            </Badge>
          </div>
        </div>
        
        <h3 className="text-white font-bold text-lg mb-3">{resource.title}</h3>
        <p className="text-blue-100 text-sm mb-4">{resource.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-blue-300">
            <Download className="w-3 h-3" />
            <span>{resource.downloads} downloads</span>
          </div>
          <div className="flex space-x-2">
            {resource.hasPreview && (
              <Button 
                size="sm" 
                variant="outline"
                className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                onClick={() => onPreview(resource)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onDownload(resource)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
