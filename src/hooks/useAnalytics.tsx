import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGA4Analytics } from '@/hooks/useGA4Analytics';

interface AnalyticsEvent {
  event_type: string;
  page_url: string;
  session_id: string;
  user_id?: string;
  event_data?: any;
  referrer?: string;
}

export const useAnalytics = () => {
  const ga4 = useGA4Analytics();

  // Generate or get session ID
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }, []);

  // Track event function
  const trackEvent = useCallback(async (eventType: string, eventData?: any) => {
    try {
      const sessionId = getSessionId();
      const userId = (await supabase.auth.getUser()).data.user?.id;

      // Track to both GA4 and Supabase
      console.log('Analytics: Tracking event to GA4 and Supabase', { eventType, eventData });
      ga4.trackEvent(eventType, eventData);

      // Track directly to analytics_events table
      const { error } = await supabase.from('analytics_events').insert({
        event_type: eventType,
        page_url: window.location.href,
        session_id: sessionId,
        user_id: userId,
        event_data: eventData || {}
      });

      if (error) {
        console.error('Analytics tracking error:', error);
        throw error;
      }
      console.log('Analytics: Event tracked successfully to database:', eventType);
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }, [getSessionId, ga4]);

  // Track page view
  const trackPageView = useCallback(() => {
    console.log('Analytics: Tracking page view for', window.location.pathname);
    // Track to GA4
    ga4.trackPageView();
    
    // Track to Supabase
    trackEvent('page_view', {
      title: document.title,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    });
  }, [trackEvent, ga4]);

  // Track button click
  const trackButtonClick = useCallback((buttonName: string, additionalData?: any) => {
    trackEvent('button_click', {
      button_name: buttonName,
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }, [trackEvent]);

  // Track form submission
  const trackFormSubmission = useCallback((formName: string, formData?: any) => {
    console.log('Analytics: Tracking form submission', { formName, formData });
    // Track to GA4
    ga4.trackFormSubmission(formName, formData);
    
    // Track to Supabase
    trackEvent('form_submission', {
      form_name: formName,
      timestamp: new Date().toISOString(),
      form_data: formData || {}
    });
  }, [trackEvent, ga4]);

  // Track time spent on page
  const trackTimeOnPage = useCallback(() => {
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      trackEvent('page_exit', {
        time_spent_seconds: timeSpent,
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackEvent]);

  // Auto-track page views
  useEffect(() => {
    trackPageView();
    const cleanup = trackTimeOnPage();
    return cleanup;
  }, [trackPageView, trackTimeOnPage]);

  // Track clicks on links and buttons automatically
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        const elementText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown';
        trackButtonClick(elementText, {
          element_type: target.tagName.toLowerCase(),
          element_id: target.id,
          element_class: target.className
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackButtonClick]);

  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackFormSubmission,
    trackTimeOnPage
  };
};