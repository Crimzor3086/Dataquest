
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

const RealTimeUpdates = () => {
  const { updates, loading } = useRealTimeUpdates();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-600/20 text-green-400 border-green-400';
      case 'warning': return 'bg-yellow-600/20 text-yellow-400 border-yellow-400';
      case 'error': return 'bg-red-600/20 text-red-400 border-red-400';
      default: return 'bg-blue-600/20 text-blue-400 border-blue-400';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Latest Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Loading updates...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Latest Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No updates available</div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                {getIcon(update.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white text-sm font-semibold">{update.title}</h4>
                    <Badge className={getTypeColor(update.type)}>
                      {update.type}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-xs">{update.message}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(update.created_at).toLocaleString()}
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

export default RealTimeUpdates;
