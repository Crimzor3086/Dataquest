import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import WebinarCard from '@/components/webinars/WebinarCard';
import WebinarCalendar from '@/components/webinars/WebinarCalendar';
import TimezoneConverter from '@/components/webinars/TimezoneConverter';
import WebinarRegistrationForm from '@/components/WebinarRegistrationForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Video, Play, Users, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useWebinars, useWebinarRecordings, useWebinarMutations } from '@/hooks/useWebinarManagement';

const Webinars = () => {
  const [showRegistration, setShowRegistration] = useState<string | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);

  const { data: allWebinars = [], isLoading } = useWebinars();
  const { data: upcomingWebinars = [] } = useWebinars({ upcoming: true });
  const { data: recordings = [] } = useWebinarRecordings();
  const { registerForWebinar } = useWebinarMutations();

  const handleRegister = (webinar: any) => {
    setSelectedWebinar(webinar);
    setShowRegistration(webinar.id);
  };

  const handleJoin = (webinar: any) => {
    if (webinar.meeting_link) {
      window.open(webinar.meeting_link, '_blank');
      toast.success(`Joining ${webinar.title}...`);
    } else {
      toast.error('Meeting link not available');
    }
  };

  const handleViewRecording = (webinar: any) => {
    // Find recording for this webinar
    const recording = recordings.find(r => r.webinar_id === webinar.id);
    if (recording) {
      window.open(recording.video_url, '_blank');
      toast.success(`Opening recording for ${webinar.title}`);
    } else {
      toast.info('Recording not yet available');
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(null);
    setSelectedWebinar(null);
  };

  // Legacy webinar action handler for backward compatibility
  const handleWebinarAction = (webinar: any) => {
    if (webinar.status === 'upcoming') {
      setShowRegistration(webinar.id);
    } else if (webinar.status === 'completed' && webinar.meeting_link) {
      toast.info(`Opening recording for "${webinar.title}"`);
      window.open(webinar.meeting_link, '_blank');
    }
  };

  // Separate webinars by status
  const upcomingWebinarsList = allWebinars.filter(w => w.status === 'upcoming');
  const liveWebinars = allWebinars.filter(w => w.status === 'live');
  const completedWebinars = allWebinars.filter(w => w.status === 'completed');

  if (showRegistration) {
    const webinar = selectedWebinar || allWebinars.find((w) => w.id === showRegistration);
    return (
      <>
        <SEO 
          title={`Register for ${webinar?.title || 'Webinar'} | DataQuest Solutions`}
          description={`Register for our upcoming webinar: ${webinar?.title || 'DataQuest Solutions Webinar'}`}
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Timezone Converter */}
            {webinar && (
              <div className="mb-8">
                <TimezoneConverter 
                  webinarDate={webinar.scheduled_date}
                  webinarTimezone={webinar.timezone}
                />
              </div>
            )}
            
            <WebinarRegistrationForm
              webinarId={showRegistration}
              webinarTitle={webinar?.title || ''}
              onSuccess={handleRegistrationSuccess}
              onCancel={() => setShowRegistration(null)}
            />
          </div>
        </div>
        <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Webinars - Live Data Science Training Sessions | DataQuest Solutions"
        description="Join our expert-led webinars on data science, machine learning, and analytics. Register for upcoming sessions or watch recordings of past webinars."
        keywords={['data science webinars', 'machine learning training', 'live analytics sessions', 'data science events Kenya']}
        url="https://dataquestsolutions.com/webinars"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">Webinars</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join our expert-led webinars to expand your knowledge in data science, machine learning, and analytics.
            </p>
          </div>

          {/* Live Webinars Alert */}
          {liveWebinars.length > 0 && (
            <div className="mb-8">
              <Card className="bg-red-600/20 border-red-600 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-bold">🔴 LIVE NOW: {liveWebinars[0].title}</span>
                    </div>
                    <Button 
                      onClick={() => handleJoin(liveWebinars[0])}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Join Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Webinar Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-blue-800/50">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600">
                Upcoming ({upcomingWebinarsList.length})
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-600">
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="recordings" className="data-[state=active]:bg-blue-600">
                Recordings ({recordings.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                All Webinars ({allWebinars.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Webinars */}
            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-blue-200">Loading webinars...</p>
                </div>
              ) : upcomingWebinarsList.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-300 text-lg">No upcoming webinars scheduled</p>
                  <p className="text-blue-400 text-sm">Check back soon for new sessions!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingWebinarsList.map((webinar) => (
                    <WebinarCard
                      key={webinar.id}
                      webinar={webinar}
                      onRegister={handleRegister}
                      onJoin={handleJoin}
                      onViewRecording={handleViewRecording}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Calendar View */}
            <TabsContent value="calendar">
              <WebinarCalendar 
                webinars={allWebinars}
                onWebinarSelect={(webinar) => {
                  setSelectedWebinar(webinar);
                  if (webinar.status === 'upcoming') {
                    setShowRegistration(webinar.id);
                  }
                }}
              />
            </TabsContent>

            {/* Recordings */}
            <TabsContent value="recordings">
              {recordings.length === 0 ? (
                <div className="text-center py-12">
                  <Play className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-300 text-lg">No recordings available yet</p>
                  <p className="text-blue-400 text-sm">Recordings will be available after webinars are completed</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recordings.map((recording) => (
                    <Card key={recording.id} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
                      {recording.thumbnail_url && (
                        <div className="relative">
                          <img 
                            src={recording.thumbnail_url} 
                            alt={recording.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-t-lg">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-white font-bold text-lg mb-2">{recording.title}</h3>
                        <div className="flex items-center justify-between text-xs text-blue-200 mb-4">
                          {recording.duration_minutes && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{recording.duration_minutes} min</span>
                            </div>
                          )}
                          {recording.file_size_mb && (
                            <span>{recording.file_size_mb.toFixed(1)} MB</span>
                          )}
                        </div>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.open(recording.video_url, '_blank')}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Recording
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* All Webinars */}
            <TabsContent value="all">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-blue-200">Loading all webinars...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allWebinars.map((webinar) => (
                    <WebinarCard
                      key={webinar.id}
                      webinar={webinar}
                      onRegister={handleRegister}
                      onJoin={handleJoin}
                      onViewRecording={handleViewRecording}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-blue-800/30 border-blue-700 text-center">
              <CardContent className="p-6">
                <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{allWebinars.length}</div>
                <div className="text-blue-300 text-sm">Total Webinars</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-800/30 border-blue-700 text-center">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{upcomingWebinarsList.length}</div>
                <div className="text-blue-300 text-sm">Upcoming</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-800/30 border-blue-700 text-center">
              <CardContent className="p-6">
                <Play className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{recordings.length}</div>
                <div className="text-blue-300 text-sm">Recordings</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-800/30 border-blue-700 text-center">
              <CardContent className="p-6">
                <Globe className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Global</div>
                <div className="text-blue-300 text-sm">Timezone Support</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      </div>
    </>
  );
};

export default Webinars;