import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Users, Video, Globe, Play } from 'lucide-react';
import { Webinar } from '@/hooks/useWebinarManagement';

interface WebinarCardProps {
  webinar: Webinar;
  onRegister: (webinar: Webinar) => void;
  onJoin: (webinar: Webinar) => void;
  onViewRecording: (webinar: Webinar) => void;
}

const WebinarCard: React.FC<WebinarCardProps> = ({ 
  webinar, 
  onRegister, 
  onJoin, 
  onViewRecording 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-600/20 text-blue-400 border-blue-400';
      case 'live': return 'bg-red-600/20 text-red-400 border-red-400';
      case 'completed': return 'bg-gray-600/20 text-gray-400 border-gray-400';
      case 'cancelled': return 'bg-red-600/20 text-red-400 border-red-400';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-400';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom': return '📹';
      case 'google_meet': return '🎥';
      case 'teams': return '💼';
      default: return '🌐';
    }
  };

  const formatDateTime = (dateString: string, timezone: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone
      })
    };
  };

  const { date, time } = formatDateTime(webinar.scheduled_date, webinar.timezone);

  const isUpcoming = webinar.status === 'upcoming';
  const isLive = webinar.status === 'live';
  const isCompleted = webinar.status === 'completed';
  const isCancelled = webinar.status === 'cancelled';

  const getActionButton = () => {
    if (isCancelled) {
      return (
        <Button disabled className="w-full bg-gray-600 cursor-not-allowed">
          Cancelled
        </Button>
      );
    }

    if (isLive) {
      return (
        <Button 
          onClick={() => onJoin(webinar)}
          className="w-full bg-red-600 hover:bg-red-700 animate-pulse"
        >
          <Video className="w-4 h-4 mr-2" />
          Join Live Now
        </Button>
      );
    }

    if (isCompleted) {
      return (
        <Button 
          onClick={() => onViewRecording(webinar)}
          variant="outline"
          className="w-full border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          View Recording
        </Button>
      );
    }

    if (isUpcoming) {
      const registrationDeadlinePassed = webinar.registration_deadline 
        ? new Date() > new Date(webinar.registration_deadline)
        : false;

      if (registrationDeadlinePassed) {
        return (
          <Button disabled className="w-full bg-gray-600 cursor-not-allowed">
            Registration Closed
          </Button>
        );
      }

      return (
        <Button 
          onClick={() => onRegister(webinar)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Users className="w-4 h-4 mr-2" />
          Register Now
        </Button>
      );
    }

    return null;
  };

  return (
    <Card className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
      {webinar.image_url && (
        <div className="relative">
          <img 
            src={webinar.image_url} 
            alt={webinar.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className={`absolute top-4 right-4 ${getStatusColor(webinar.status)}`}>
            {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
          </Badge>
          {isLive && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
              🔴 LIVE
            </div>
          )}
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {!webinar.image_url && (
            <Badge className={getStatusColor(webinar.status)}>
              {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
            </Badge>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getPlatformIcon(webinar.platform)}</span>
            <Badge variant="outline" className="border-blue-600 text-blue-300 capitalize">
              {webinar.webinar_type}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-white text-lg line-clamp-2">{webinar.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-blue-100 text-sm mb-4 line-clamp-3">{webinar.description}</p>
        
        {/* Webinar Details */}
        <div className="space-y-2 mb-4 text-blue-100 text-xs">
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3 text-blue-400" />
            <span>Presenter: {webinar.presenter}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 text-blue-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{time} ({webinar.timezone})</span>
          </div>
          {webinar.duration_minutes && (
            <div className="flex items-center space-x-2">
              <Video className="w-3 h-3 text-blue-400" />
              <span>Duration: {webinar.duration_minutes} minutes</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3 text-blue-400" />
            <span>Max: {webinar.max_attendees} attendees</span>
          </div>
        </div>

        {/* Tags */}
        {(() => {
          const tagsToDisplay = webinar.tags || [];
          return tagsToDisplay.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {tagsToDisplay.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-700 text-blue-200 text-xs">
                  {tag}
                </Badge>
              ))}
              {tagsToDisplay.length > 3 && (
                <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                  +{tagsToDisplay.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          );
        })()}

        {/* Registration Deadline Warning */}
        {isUpcoming && webinar.registration_deadline && (
          <div className="mb-4 p-2 bg-yellow-600/20 border border-yellow-600/30 rounded text-xs">
            <span className="text-yellow-300">
              Registration closes: {new Date(webinar.registration_deadline).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Action Button */}
        {getActionButton()}
      </CardContent>
    </Card>
  );
};

export default WebinarCard;