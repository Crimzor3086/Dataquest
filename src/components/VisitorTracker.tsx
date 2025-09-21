
import { useEffect, useRef } from 'react';
import { useVisitorAnalytics } from '@/hooks/useVisitorAnalytics';

const VisitorTracker = () => {
  const { trackVisitor } = useVisitorAnalytics();
  const hasTracked = useRef(false);
  const lastTrackTime = useRef(0);

  useEffect(() => {
    const trackCurrentVisit = async () => {
      // Prevent multiple tracking calls in the same session
      if (hasTracked.current) {
        return;
      }

      // Rate limiting: only track once per 5 minutes
      const now = Date.now();
      if (now - lastTrackTime.current < 5 * 60 * 1000) {
        return;
      }

      try {
        console.log('Starting visitor tracking...');
        hasTracked.current = true;
        lastTrackTime.current = now;

        // Use a more reliable IP service with better rate limits
        let locationData = {};
        
        try {
          // Try ipapi.co first (has better free tier)
          const response = await fetch('https://api.ipify.org?format=json');
          if (response.ok) {
            const ipData = await response.json();
            console.log('IP data received:', ipData);
            
            // Use a different geolocation service to avoid rate limits
            const geoResponse = await fetch(`https://ip-api.com/json/${ipData.ip}?fields=country,countryCode,city,region`);
            if (geoResponse.ok) {
              locationData = await geoResponse.json();
            }
          }
        } catch (geoError) {
          console.log('Geolocation fetch failed, using default data:', geoError);
        }
        
        await trackVisitor({
          country_code: locationData.countryCode || 'KE',
          country_name: locationData.country || 'Kenya', 
          city: locationData.city || 'Nairobi',
          page_url: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || undefined
        });
        
      } catch (error) {
        console.log('Location fetch failed, tracking with default data:', error);
        // Fallback - track with default Kenya data
        await trackVisitor({
          country_code: 'KE',
          country_name: 'Kenya',
          city: 'Nairobi',
          page_url: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || undefined
        });
      } finally {
        console.log('[VisitorTracker] Finished visit tracking attempt');
      }
    };

    // Track visit after a longer delay to avoid spam
    const timer = setTimeout(trackCurrentVisit, 3000);
    return () => clearTimeout(timer);
  }, [trackVisitor]);

  return null; // This component doesn't render anything
};

export default VisitorTracker;
