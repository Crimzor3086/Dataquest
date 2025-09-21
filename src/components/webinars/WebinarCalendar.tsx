import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Video } from 'lucide-react';
import { Webinar } from '@/hooks/useWebinarManagement';

interface WebinarCalendarProps {
  webinars: Webinar[];
  onWebinarSelect: (webinar: Webinar) => void;
}

const WebinarCalendar: React.FC<WebinarCalendarProps> = ({ webinars, onWebinarSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get webinars for selected date
  const getWebinarsForDate = (date: Date) => {
    return webinars.filter(webinar => {
      const webinarDate = new Date(webinar.scheduled_date);
      return webinarDate.toDateString() === date.toDateString();
    });
  };

  // Get all dates that have webinars
  const webinarDates = webinars.map(webinar => new Date(webinar.scheduled_date));

  const selectedDateWebinars = selectedDate ? getWebinarsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-600';
      case 'live': return 'bg-red-600';
      case 'completed': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-800';
      default: return 'bg-gray-600';
    }
  };

  const formatTime = (dateString: string, timezone: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card className="bg-blue-800/50 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Webinar Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border border-blue-600 bg-blue-900/50"
            modifiers={{
              hasWebinar: webinarDates
            }}
            modifiersStyles={{
              hasWebinar: { 
                backgroundColor: '#3B82F6', 
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          />
          <div className="mt-4 text-xs text-blue-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Days with webinars</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Webinars */}
      <Card className="bg-blue-800/50 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedDate 
              ? `Webinars on ${selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
              : 'Select a Date'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateWebinars.length === 0 ? (
            <div className="text-center py-8 text-blue-300">
              {selectedDate 
                ? 'No webinars scheduled for this date'
                : 'Select a date to view webinars'
              }
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateWebinars.map((webinar) => (
                <div 
                  key={webinar.id} 
                  className="p-4 bg-blue-700/30 rounded-lg border border-blue-600/30 cursor-pointer hover:bg-blue-700/50 transition-colors"
                  onClick={() => onWebinarSelect(webinar)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold text-sm">{webinar.title}</h4>
                    <Badge className={getStatusColor(webinar.status)}>
                      {webinar.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-blue-200">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(webinar.scheduled_date, webinar.timezone)} ({webinar.timezone})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3" />
                      <span>{webinar.presenter}</span>
                    </div>
                    {webinar.duration_minutes && (
                      <div className="flex items-center space-x-2">
                        <Video className="w-3 h-3" />
                        <span>{webinar.duration_minutes} minutes</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-blue-100 text-xs mt-2 line-clamp-2">
                    {webinar.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebinarCalendar;