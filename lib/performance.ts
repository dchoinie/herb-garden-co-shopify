/**
 * Performance Optimization Utilities
 * Handles caching, lazy loading, and performance monitoring
 */

// Cache configuration
const CACHE_CONFIG = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  maxSize: 50, // Maximum number of cached items
};

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Cache management
 */
export class CacheManager {
  static set(key: string, data: any): void {
    // Remove oldest items if cache is full
    if (cache.size >= CACHE_CONFIG.maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  static get(key: string): any | null {
    const item = cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (Date.now() - item.timestamp > CACHE_CONFIG.maxAge) {
      cache.delete(key);
      return null;
    }

    return item.data;
  }

  static clear(): void {
    cache.clear();
  }

  static has(key: string): boolean {
    const item = cache.get(key);
    if (!item) return false;

    // Check if item has expired
    if (Date.now() - item.timestamp > CACHE_CONFIG.maxAge) {
      cache.delete(key);
      return false;
    }

    return true;
  }
}

/**
 * Lazy loading utilities
 */
export function lazyLoadImage(
  src: string,
  placeholder?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  static startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  static endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    return duration;
  }

  static measureAsync<T>(label: string, asyncFn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return asyncFn().finally(() => {
      const duration = this.endTiming(label);
      console.log(`${label} took ${duration.toFixed(2)}ms`);
    });
  }
}

/**
 * Resource optimization
 */
export function optimizeImageUrl(
  url: string,
  width?: number,
  height?: number
): string {
  if (!url) return url;

  // For Shopify images, add transformation parameters
  if (url.includes("cdn.shopify.com")) {
    const params = new URLSearchParams();
    if (width) params.set("width", width.toString());
    if (height) params.set("height", height.toString());
    params.set("format", "webp");
    params.set("quality", "80");

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${params.toString()}`;
  }

  return url;
}

/**
 * Bundle size optimization
 */
export function preloadCriticalResources(): void {
  if (typeof window === "undefined") return;

  // Preload critical fonts
  const fontLink = document.createElement("link");
  fontLink.rel = "preload";
  fontLink.href = "/fonts/FunnelSans-VariableFont_wght.ttf";
  fontLink.as = "font";
  fontLink.type = "font/ttf";
  fontLink.crossOrigin = "anonymous";
  document.head.appendChild(fontLink);

  // Preload critical images
  const criticalImages = ["/logo.webp", "/hero.webp"];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = src;
    link.as = "image";
    document.head.appendChild(link);
  });
}

/**
 * Memory management
 */
export function cleanupResources(): void {
  // Clear cache
  CacheManager.clear();

  // Clear any pending timeouts/intervals
  // This would need to be implemented based on your specific use case

  // Force garbage collection if available (development only)
  if (process.env.NODE_ENV === "development" && window.gc) {
    window.gc();
  }
}

// Extend Window interface for garbage collection
declare global {
  interface Window {
    gc?: () => void;
  }
}
