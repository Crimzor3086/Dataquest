import { useEffect, useCallback } from 'react';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const useGA4Analytics = () => {
  // Initialize GA4 if not already loaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.gtag) {
        console.warn('GA4 gtag not found. Make sure the GA4 script is loaded in index.html');
      } else {
        console.log('GA4 gtag initialized successfully with measurement ID: G-VWXLN0LPY3');
      }
    }
  }, []);

  // Track page view
  const trackPageView = useCallback((page_title?: string, page_location?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('GA4: Tracking page view', { page_title, page_location });
      window.gtag('event', 'page_view', {
        page_title: page_title || document.title,
        page_location: page_location || window.location.href,
        page_path: window.location.pathname,
        measurement_id: 'G-VWXLN0LPY3'
      });
    } else {
      console.warn('GA4: gtag not available for page view tracking');
    }
  }, []);

  // Track custom events
  const trackEvent = useCallback((event_name: string, parameters?: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('GA4: Tracking event', { event_name, parameters });
      window.gtag('event', event_name, {
        event_category: 'engagement',
        event_label: event_name,
        timestamp: new Date().toISOString(),
        measurement_id: 'G-VWXLN0LPY3',
        ...parameters
      });
    } else {
      console.warn('GA4: gtag not available for event tracking');
    }
  }, []);

  // Track form submissions
  const trackFormSubmission = useCallback((form_name: string, form_data?: any) => {
    trackEvent('form_submit', {
      form_name,
      event_category: 'form_interaction',
      value: 1,
      ...form_data
    });
  }, [trackEvent]);

  // Track course enrollment
  const trackCourseEnrollment = useCallback((course_name: string, student_id?: string) => {
    trackEvent('course_enrolled', {
      course_name,
      student_id,
      event_category: 'course_interaction',
      value: 1
    });
  }, [trackEvent]);

  // Track video play
  const trackVideoPlay = useCallback((video_title: string, video_duration?: number) => {
    trackEvent('video_play', {
      video_title,
      video_duration,
      event_category: 'video_interaction',
      value: 1
    });
  }, [trackEvent]);

  // Track material download
  const trackMaterialDownload = useCallback((material_name: string, material_type?: string) => {
    trackEvent('material_downloaded', {
      material_name,
      material_type,
      event_category: 'download',
      value: 1
    });
  }, [trackEvent]);

  // Track login success
  const trackLoginSuccess = useCallback((user_id?: string, user_type?: string) => {
    trackEvent('login_success', {
      user_id,
      user_type,
      event_category: 'authentication',
      value: 1
    });
  }, [trackEvent]);

  // Track scroll depth
  const trackScrollDepth = useCallback((scroll_depth: number) => {
    trackEvent('scroll', {
      scroll_depth,
      event_category: 'engagement',
      value: scroll_depth
    });
  }, [trackEvent]);

  // Track button clicks
  const trackButtonClick = useCallback((button_name: string, button_location?: string) => {
    trackEvent('button_click', {
      button_name,
      button_location,
      event_category: 'ui_interaction',
      value: 1
    });
  }, [trackEvent]);

  // Track time on page
  const trackTimeOnPage = useCallback(() => {
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('page_exit', {
        time_spent_seconds: timeSpent,
        event_category: 'engagement',
        value: timeSpent
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackEvent]);

  // Set user properties
  const setUserProperties = useCallback((properties: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('GA4: Setting user properties', properties);
      window.gtag('config', 'G-VWXLN0LPY3', {
        user_properties: properties,
        send_page_view: false
      });
    } else {
      console.warn('GA4: gtag not available for user properties');
    }
  }, []);

  // Track conversion events
  const trackConversion = useCallback((conversion_name: string, value?: number, currency?: string) => {
    trackEvent(conversion_name, {
      value: value || 1,
      currency: currency || 'KES',
      event_category: 'conversion'
    });
  }, [trackEvent]);

  return {
    trackPageView,
    trackEvent,
    trackFormSubmission,
    trackCourseEnrollment,
    trackVideoPlay,
    trackMaterialDownload,
    trackLoginSuccess,
    trackScrollDepth,
    trackButtonClick,
    trackTimeOnPage,
    setUserProperties,
    trackConversion
  };
};