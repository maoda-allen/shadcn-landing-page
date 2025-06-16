// Google Analytics utilities
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: any
    ) => void;
    dataLayer: any[];
  }
}

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = 'G-TYW6BEQR0Z';

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, parameters?: {
  event_category?: string;
  event_label?: string;
  event_value?: number;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: parameters?.event_category || 'engagement',
      event_label: parameters?.event_label,
      value: parameters?.event_value,
      ...parameters,
    });
  }
};

// Predefined events for birthday party planner
export const analytics = {
  // Party planning events
  partyPlanGenerated: (partyType: string, theme: string) => {
    trackEvent('party_plan_generated', {
      event_category: 'party_planning',
      event_label: `${partyType}_${theme}`,
      custom_parameters: {
        party_type: partyType,
        theme: theme,
      }
    });
  },

  partyPlanExported: (format: string) => {
    trackEvent('party_plan_exported', {
      event_category: 'engagement',
      event_label: format,
      export_format: format,
    });
  },

  formFieldChanged: (fieldName: string, value: string) => {
    trackEvent('form_field_changed', {
      event_category: 'form_interaction',
      event_label: fieldName,
      field_name: fieldName,
      field_value: value,
    });
  },

  themeSelected: (theme: string, partyType: string) => {
    trackEvent('theme_selected', {
      event_category: 'party_planning',
      event_label: theme,
      party_type: partyType,
      theme: theme,
    });
  },

  languageChanged: (newLanguage: string) => {
    trackEvent('language_changed', {
      event_category: 'settings',
      event_label: newLanguage,
      language: newLanguage,
    });
  },

  // Navigation events
  navigationClick: (linkName: string, destination: string) => {
    trackEvent('navigation_click', {
      event_category: 'navigation',
      event_label: linkName,
      destination: destination,
    });
  },

  // Feature usage
  featureUsed: (featureName: string, details?: string) => {
    trackEvent('feature_used', {
      event_category: 'feature_usage',
      event_label: featureName,
      feature_details: details,
    });
  },

  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string) => {
    trackEvent('error_occurred', {
      event_category: 'errors',
      event_label: errorType,
      error_message: errorMessage,
    });
  },
}; 