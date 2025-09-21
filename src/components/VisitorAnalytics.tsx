
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Users, TrendingUp } from 'lucide-react';
import { useVisitorAnalytics } from '@/hooks/useVisitorAnalytics';

const VisitorAnalytics = () => {
  const { visitorData, loading } = useVisitorAnalytics();

  const getCountryFlag = (countryCode: string) => {
    // Simple flag emoji mapping
    const flags: { [key: string]: string } = {
      'KE': '🇰🇪', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼',
      'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
      'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸',
      'BR': '🇧🇷', 'IN': '🇮🇳', 'CN': '🇨🇳', 'JP': '🇯🇵'
    };
    return flags[countryCode] || '🌍';
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Visitor Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Loading visitor data...</div>
        </CardContent>
      </Card>
    );
  }

  // Enhanced error and debugging
  if (!visitorData || !Array.isArray(visitorData)) {
    console.error('Visitor data error:', { visitorData, type: typeof visitorData });
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Visitor Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400 font-semibold">
            Failed to load visitor data. 
            <br />
            <span className="text-sm">Database connection or visitor tracking may need configuration.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVisitors = visitorData.reduce((sum, country) => sum + country.visitor_count, 0);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Visitor Analytics by Country
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white font-semibold">Total Visitors: {totalVisitors}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+15% this month</span>
          </div>
        </div>
        {/* Enhanced message if no visitors */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {visitorData.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No visitor data available yet.<br />
              <span className="text-xs">Visitor tracking is active. Data will appear as users visit the site.</span>
            </div>
          ) : (
            visitorData.map((country, index) => (
              <div key={country.country_code} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCountryFlag(country.country_code)}</span>
                  <div>
                    <p className="text-white font-medium">{country.country_name}</p>
                    <p className="text-gray-400 text-sm">{country.country_code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-bold">{country.visitor_count}</p>
                  <p className="text-gray-500 text-xs">
                    {((country.visitor_count / totalVisitors) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorAnalytics;
