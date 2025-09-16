/**
 * Analytics and Performance Tracking
 * Handles conversion tracking, A/B testing, and performance metrics
 */

// Google Analytics 4 Event Types
export interface AnalyticsEvent {
  event_name: string;
  parameters: {
    currency?: string;
    value?: number;
    items?: Array<{
      item_id: string;
      item_name: string;
      quantity: number;
      price: number;
    }>;
    payment_method?: string;
    checkout_step?: number;
    [key: string]: any;
  };
}

// Performance Metrics
export interface PerformanceMetrics {
  pageLoadTime: number;
  checkoutStartTime: number;
  formCompletionTime: number;
  paymentInitiationTime: number;
  totalCheckoutTime: number;
}

// A/B Testing Configuration
export interface ABTestConfig {
  testName: string;
  variants: Array<{
    name: string;
    weight: number;
    config: any;
  }>;
}

/**
 * Initialize analytics tracking
 */
export function initializeAnalytics() {
  if (typeof window === "undefined") return;

  // Initialize performance tracking
  const startTime = performance.now();

  // Track page load
  window.addEventListener("load", () => {
    const loadTime = performance.now() - startTime;
    trackEvent("page_load", {
      load_time: Math.round(loadTime),
      page: window.location.pathname,
    });
  });

  // Track checkout start
  trackEvent("checkout_start", {
    timestamp: Date.now(),
  });
}

/**
 * Track custom events
 */
export function trackEvent(eventName: string, parameters: any = {}) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag("event", eventName, parameters);
  }

  // Console logging for development
  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Event:", eventName, parameters);
  }
}

/**
 * Track checkout funnel events
 */
export function trackCheckoutStep(step: number, stepName: string, data?: any) {
  trackEvent("checkout_step", {
    step_number: step,
    step_name: stepName,
    ...data,
  });
}

/**
 * Track conversion events
 */
export function trackConversion(
  eventName: string,
  value: number,
  currency: string = "USD"
) {
  trackEvent(eventName, {
    currency,
    value,
    timestamp: Date.now(),
  });
}

/**
 * Track performance metrics
 */
export function trackPerformance(metrics: Partial<PerformanceMetrics>) {
  trackEvent("performance_metrics", {
    ...metrics,
    timestamp: Date.now(),
  });
}

/**
 * A/B Testing utilities
 */
export function getABTestVariant(testName: string): string {
  if (typeof window === "undefined") return "control";

  const stored = localStorage.getItem(`ab_test_${testName}`);
  if (stored) return stored;

  // Simple random assignment (50/50)
  const variant = Math.random() < 0.5 ? "variant_a" : "variant_b";
  localStorage.setItem(`ab_test_${testName}`, variant);

  trackEvent("ab_test_assignment", {
    test_name: testName,
    variant,
  });

  return variant;
}

/**
 * Track form field interactions
 */
export function trackFormField(
  fieldName: string,
  action: "focus" | "blur" | "change"
) {
  trackEvent("form_field_interaction", {
    field_name: fieldName,
    action,
    timestamp: Date.now(),
  });
}

/**
 * Track errors
 */
export function trackError(error: Error, context?: string) {
  trackEvent("error", {
    error_message: error.message,
    error_stack: error.stack,
    context,
    timestamp: Date.now(),
  });
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
