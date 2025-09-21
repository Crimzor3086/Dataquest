import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  items: { event_type: string; count: number }[];
}

export default function TopEventsCard({ items }: Props) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Top Events</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-gray-400">No events recorded.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.event_type} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                <span className="text-white text-sm">{it.event_type}</span>
                <span className="text-blue-400 font-semibold">{it.count}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}