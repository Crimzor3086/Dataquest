import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AnalyticsFiltersState } from '@/hooks/useAnalyticsEvents';

interface Props {
  filters: AnalyticsFiltersState;
  onChange: (next: AnalyticsFiltersState) => void;
}

const eventOptions = [
  { value: 'all', label: 'All events' },
  { value: 'page_visit', label: 'Page visits' },
  { value: 'form_submit', label: 'Form submits' },
  { value: 'course_enrollment', label: 'Course enrollments' },
  { value: 'payment_success', label: 'Payments (success)' },
  { value: 'payment_error', label: 'Payments (error)' },
  { value: 'webinar_register', label: 'Webinar registrations' },
  { value: 'resource_download', label: 'Resource downloads' },
];

export default function AnalyticsFilters({ filters, onChange }: Props) {
  const today = useMemo(() => new Date(), []);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Start date</p>
            <Calendar
              mode="single"
              selected={filters.startDate ?? undefined}
              onSelect={(d) => onChange({ ...filters, startDate: d ?? null })}
              className="rounded-md border border-gray-700 bg-gray-800"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">End date</p>
            <Calendar
              mode="single"
              selected={filters.endDate ?? undefined}
              onSelect={(d) => onChange({ ...filters, endDate: d ?? null })}
              className="rounded-md border border-gray-700 bg-gray-800"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Event type</p>
            <Select
              value={filters.eventType}
              onValueChange={(v) => onChange({ ...filters, eventType: v as any })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                {eventOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Separator className="my-6 bg-gray-700" />
            <div className="text-xs text-gray-400">
              Today: {today.toISOString().slice(0,10)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}