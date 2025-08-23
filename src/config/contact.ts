// Contact information configuration
// Centralized contact details for easy maintenance

export const CONTACT_INFO = {
  // Primary contact details
  email: 'Sanpark.angkor@googlemail.com',
  phone: '+855 12 788 354',
  whatsapp: '+855 12 788 354',
  
  // Business information
  businessName: 'Sanpark Angkor Tour Guide Service',
  address: {
    street: 'Siem Reap',
    city: 'Siem Reap',
    country: 'Cambodia',
    full: 'Siem Reap, Cambodia'
  },
  
  // Operating hours
  hours: {
    availability: '24/7',
    responseTime: 'Within 24 hours',
    preferredHours: '8:00 AM - 8:00 PM (Cambodia Time)'
  },
  
  // Social media and web presence
  social: {
    website: 'https://sanparkangkor.com',
    facebook: 'https://facebook.com/sanparkangkor',
    instagram: 'https://instagram.com/sanparkangkor',
    tripadvisor: 'https://tripadvisor.com/sanparkangkor'
  },
  
  // WhatsApp and communication
  whatsappUrl: 'https://wa.me/85512788354',
  emailUrl: 'mailto:Sanpark.angkor@googlemail.com',
  phoneUrl: 'tel:+85512788354',
  
  // Booking and inquiry messages
  messages: {
    whatsappBooking: 'Hello! I would like to book a tour with Sanpark Angkor. Could you please provide more information?',
    whatsappInquiry: 'Hi! I have some questions about your Angkor tour services.',
    emailSubject: 'Tour Inquiry - Sanpark Angkor'
  }
};

// Helper functions for contact actions
export const contactActions = {
  // Open WhatsApp with pre-filled message
  openWhatsApp: (message?: string) => {
    const defaultMessage = message || CONTACT_INFO.messages.whatsappBooking;
    const encodedMessage = encodeURIComponent(defaultMessage);
    const url = `${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  
  // Open email client with pre-filled subject
  openEmail: (subject?: string, body?: string) => {
    const emailSubject = subject || CONTACT_INFO.messages.emailSubject;
    const emailBody = body || '';
    const url = `${CONTACT_INFO.emailUrl}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  
  // Initiate phone call
  makeCall: () => {
    window.open(CONTACT_INFO.phoneUrl, '_self');
  },
  
  // Copy contact information to clipboard
  copyToClipboard: async (type: 'email' | 'phone' | 'whatsapp') => {
    const textToCopy = CONTACT_INFO[type];
    try {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
};

// Validation helpers
export const contactValidation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
  },
  
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Format Cambodia phone number
    if (cleaned.startsWith('+855')) {
      return cleaned.replace(/(\+855)(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    }
    
    return cleaned;
  }
};

export default CONTACT_INFO;