// SEO utilities for better search engine optimization

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

// Default SEO data for the application
export const DEFAULT_SEO: SEOData = {
  title: 'Sanpark Angkor - Professional Tour Guide Service | Angkor Wat Tours',
  description: 'Experience the wonders of Angkor Wat with our expert local guides. Professional tour services in Siem Reap, Cambodia. Book your unforgettable temple tour today!',
  keywords: [
    'Angkor Wat tours',
    'Siem Reap tour guide',
    'Cambodia temple tours',
    'Angkor Thom tours',
    'Ta Prohm temple',
    'Bayon temple',
    'Professional tour guide',
    'Khmer history',
    'UNESCO World Heritage',
    'Sunrise tours Angkor'
  ],
  ogTitle: 'Sanpark Angkor - Expert Angkor Wat Tour Guides',
  ogDescription: 'Discover the ancient wonders of Angkor with our professional local guides. Personalized tours, cultural insights, and unforgettable experiences.',
  ogImage: '/images/og-angkor-wat.jpg'
};

// Page-specific SEO data
export const PAGE_SEO: Record<string, SEOData> = {
  home: {
    title: 'Sanpark Angkor - Professional Angkor Wat Tour Guides | Siem Reap',
    description: 'Experience authentic Angkor Wat tours with expert local guides. Sunrise tours, temple circuits, and cultural experiences in Siem Reap, Cambodia.',
    keywords: [
      'Angkor Wat sunrise tour',
      'Siem Reap tour guide',
      'Cambodia temple tours',
      'Angkor archaeological park',
      'Professional tour service',
      'Local Khmer guide',
      'UNESCO World Heritage tours'
    ]
  },
  tours: {
    title: 'Angkor Wat Tours & Packages | Sanpark Angkor Tour Guide Service',
    description: 'Choose from our curated Angkor temple tour packages. Sunrise tours, small circuit, grand circuit, and custom itineraries with expert guides.',
    keywords: [
      'Angkor Wat tour packages',
      'temple tour prices',
      'Angkor small circuit',
      'Angkor grand circuit',
      'Banteay Srei tours',
      'jungle temple tours',
      'custom Angkor tours'
    ]
  },
  contact: {
    title: 'Contact Us - Book Your Angkor Tour | Sanpark Angkor Guide Service',
    description: 'Contact Sanpark Angkor for tour bookings and inquiries. Quick response, flexible scheduling, and personalized tour planning for your Angkor experience.',
    keywords: [
      'book Angkor tour',
      'tour booking Cambodia',
      'Angkor tour inquiry',
      'Siem Reap tour contact',
      'custom tour planning',
      'tour guide booking'
    ]
  }
};

// Function to update page meta tags
export const updatePageSEO = (pageKey: 'home' | 'tours' | 'contact') => {
  const seoData = PAGE_SEO[pageKey] || DEFAULT_SEO;
  
  // Update title
  document.title = seoData.title;
  
  // Update meta description
  updateMetaTag('description', seoData.description);
  
  // Update keywords
  updateMetaTag('keywords', seoData.keywords.join(', '));
  
  // Update Open Graph tags
  updateMetaTag('og:title', seoData.ogTitle || seoData.title, 'property');
  updateMetaTag('og:description', seoData.ogDescription || seoData.description, 'property');
  updateMetaTag('og:type', 'website', 'property');
  
  if (seoData.ogImage) {
    updateMetaTag('og:image', seoData.ogImage, 'property');
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seoData.ogTitle || seoData.title);
  updateMetaTag('twitter:description', seoData.ogDescription || seoData.description);
  
  // Update canonical URL
  if (seoData.canonicalUrl) {
    updateLinkTag('canonical', seoData.canonicalUrl);
  }
};

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

// Helper function to update link tags
const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};

// Structured data for rich snippets
export const generateTourStructuredData = (tour: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "provider": {
      "@type": "TouristInformationCenter",
      "name": "Sanpark Angkor Tour Guide Service",
      "url": "https://sanparkangkor.com"
    },
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "duration": tour.duration,
    "location": {
      "@type": "Place",
      "name": "Angkor Archaeological Park",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Siem Reap",
        "addressCountry": "Cambodia"
      }
    }
  };
};

// Function to inject structured data
export const injectStructuredData = (data: object) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};