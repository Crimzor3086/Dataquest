import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGA4Analytics } from '@/hooks/useGA4Analytics';

const GA4Tracker = () => {
  const location = useLocation();
  const { trackPageView, trackScrollDepth, trackTimeOnPage } = useGA4Analytics();

  // Track page views on route changes
  useEffect(() => {
    console.log('GA4: Page view tracked for', location.pathname);
    trackPageView();
  }, [location, trackPageView]);

  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track scroll milestones
        if (scrollPercent >= 25 && maxScrollDepth < 25) {
          console.log('GA4: Scroll depth 25% tracked');
          trackScrollDepth(25);
        } else if (scrollPercent >= 50 && maxScrollDepth < 50) {
          console.log('GA4: Scroll depth 50% tracked');
          trackScrollDepth(50);
        } else if (scrollPercent >= 75 && maxScrollDepth < 75) {
          console.log('GA4: Scroll depth 75% tracked');
          trackScrollDepth(75);
        } else if (scrollPercent >= 90 && maxScrollDepth < 90) {
          console.log('GA4: Scroll depth 90% tracked');
          trackScrollDepth(90);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);

  // Track time on page
  useEffect(() => {
    const cleanup = trackTimeOnPage();
    return cleanup;
  }, [trackTimeOnPage]);

  // Track clicks on important elements
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON') {
        const buttonText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown Button';
        const buttonLocation = target.closest('[data-section]')?.getAttribute('data-section') || 'unknown';
        
        if (typeof window !== 'undefined' && window.gtag) {
          console.log('GA4: Button click tracked', { buttonText, buttonLocation });
          window.gtag('event', 'button_click', {
            button_name: buttonText,
            button_location: buttonLocation,
            event_category: 'ui_interaction',
            measurement_id: 'G-VWXLN0LPY3'
          });
        }
      }
      
      // Track link clicks
      if (target.tagName === 'A') {
        const linkText = target.textContent?.trim() || 'Unknown Link';
        const href = target.getAttribute('href') || '';
        
        if (typeof window !== 'undefined' && window.gtag) {
          console.log('GA4: Link click tracked', { linkText, href });
          window.gtag('event', 'link_click', {
            link_text: linkText,
            link_url: href,
            event_category: 'navigation',
            measurement_id: 'G-VWXLN0LPY3'
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // This component doesn't render anything
};

export default GA4Tracker;