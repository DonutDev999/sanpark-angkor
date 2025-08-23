// Performance optimization utilities

// Image lazy loading with intersection observer
export class LazyImageLoader {
  private observer: IntersectionObserver;
  
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );
  }
  
  observe(img: HTMLImageElement) {
    this.observer.observe(img);
  }
  
  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.add('loaded');
    }
  }
  
  disconnect() {
    this.observer.disconnect();
  }
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map(url => preloadImage(url)));
    console.log('✅ Critical images preloaded');
  } catch (error) {
    console.warn('⚠️ Some images failed to preload:', error);
  }
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }
  
  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.metrics.delete(label);
      return duration;
    }
    return 0;
  }
  
  measurePageLoad(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      console.log('📊 Page Performance Metrics:');
      console.log(`- DNS Lookup: ${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`);
      console.log(`- TCP Connection: ${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`);
      console.log(`- Request/Response: ${(navigation.responseEnd - navigation.requestStart).toFixed(2)}ms`);
      console.log(`- DOM Content Loaded: ${(navigation.domContentLoadedEventEnd - navigation.navigationStart).toFixed(2)}ms`);
      console.log(`- Page Load Complete: ${(navigation.loadEventEnd - navigation.navigationStart).toFixed(2)}ms`);
    });
  }
}

// Memory usage monitoring
export const monitorMemoryUsage = (): void => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('💾 Memory Usage:');
    console.log(`- Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`- Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`- Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
  }
};

// Critical resource hints
export const addResourceHints = (): void => {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical domains
  const preconnectDomains = [
    'https://images.unsplash.com'
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', registration);
    } catch (error) {
      console.warn('⚠️ Service Worker registration failed:', error);
    }
  }
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = (): void => {
  if (import.meta.env.DEV) {
    console.log('📦 Bundle Analysis:');
    console.log('- Vue:', import('vue').then(() => console.log('Vue loaded')));
    console.log('- PrimeVue:', import('primevue/config').then(() => console.log('PrimeVue loaded')));
    console.log('- Pinia:', import('pinia').then(() => console.log('Pinia loaded')));
  }
};

// Initialize performance optimizations
export const initializePerformanceOptimizations = (): void => {
  // Add resource hints
  addResourceHints();
  
  // Register service worker
  registerServiceWorker();
  
  // Start performance monitoring
  const monitor = PerformanceMonitor.getInstance();
  monitor.measurePageLoad();
  
  // Monitor memory usage in development
  if (import.meta.env.DEV) {
    setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
    analyzeBundleSize();
  }
  
  console.log('🚀 Performance optimizations initialized');
};