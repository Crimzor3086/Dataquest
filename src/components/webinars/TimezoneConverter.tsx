import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe, Clock } from 'lucide-react';

interface TimezoneConverterProps {
  webinarDate: string;
  webinarTimezone: string;
}

const TimezoneConverter: React.FC<TimezoneConverterProps> = ({ webinarDate, webinarTimezone }) => {
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [convertedTime, setConvertedTime] = useState<string>('');

  const commonTimezones = [
    { value: 'Africa/Nairobi', label: 'East Africa Time (EAT)' },
    { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
    { value: 'Africa/Cairo', label: 'Central Africa Time (CAT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  useEffect(() => {
    // Detect user's timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(detectedTimezone);
  }, []);

  useEffect(() => {
    if (userTimezone && webinarDate) {
      try {
        const date = new Date(webinarDate);
        const converted = date.toLocaleString('en-US', {
          timeZone: userTimezone,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });
        setConvertedTime(converted);
      } catch (error) {
        console.error('Error converting timezone:', error);
        setConvertedTime('Unable to convert timezone');
      }
    }
  }, [userTimezone, webinarDate]);

  const originalTime = new Date(webinarDate).toLocaleString('en-US', {
    timeZone: webinarTimezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <Card className="bg-blue-800/50 border-blue-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Timezone Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Original Time */}
        <div className="p-3 bg-blue-700/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Webinar Time</span>
          </div>
          <p className="text-white">{originalTime}</p>
        </div>

        {/* Timezone Selector */}
        <div>
          <label className="text-blue-200 text-sm font-medium mb-2 block">
            Convert to your timezone:
          </label>
          <Select value={userTimezone} onValueChange={setUserTimezone}>
            <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent className="bg-blue-800 border-blue-600">
              {commonTimezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value} className="text-white">
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Converted Time */}
        {convertedTime && userTimezone !== webinarTimezone && (
          <div className="p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Your Local Time</span>
            </div>
            <p className="text-white">{convertedTime}</p>
          </div>
        )}

        {/* Add to Calendar Links */}
        <div className="pt-2 border-t border-blue-600">
          <p className="text-blue-200 text-sm mb-2">Add to calendar:</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-300 hover:bg-blue-700 text-xs"
              onClick={() => {
                const startDate = new Date(webinarDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const endDate = new Date(new Date(webinarDate).getTime() + (webinarTimezone === 'Africa/Nairobi' ? 2 * 60 * 60 * 1000 : 60 * 60 * 1000)).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startDate}/${endDate}&text=${encodeURIComponent('DataQuest Webinar')}&details=${encodeURIComponent('Join our webinar')}`;
                window.open(googleUrl, '_blank');
              }}
            >
              Google
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-300 hover:bg-blue-700 text-xs"
              onClick={() => {
                const startDate = new Date(webinarDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const endDate = new Date(new Date(webinarDate).getTime() + (webinarTimezone === 'Africa/Nairobi' ? 2 * 60 * 60 * 1000 : 60 * 60 * 1000)).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent('DataQuest Webinar')}&startdt=${startDate}&enddt=${endDate}`;
                window.open(outlookUrl, '_blank');
              }}
            >
              Outlook
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimezoneConverter;