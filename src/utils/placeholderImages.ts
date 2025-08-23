// Temporary placeholder images for development
// These will be replaced with actual temple photos

export const PLACEHOLDER_IMAGES = {
  hero: {
    'angkor-wat-sunrise': 'https://images.unsplash.com/photo-1653959864991-c828b72c82a8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bayon-temple': 'https://images.unsplash.com/photo-1650347648000-b9a0581a147f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    'ta-prohm': 'https://images.unsplash.com/photo-1526324585411-e24d5ba61edd?q=80&w=1219&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'angkor-reflection': 'https://images.unsplash.com/photo-1566706546199-a93ba33ce9f7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'banteay-srei': 'https://images.unsplash.com/photo-1551432434-d5f2bdc62ce9?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  tours: {
    'sunrise-tour': 'https://picsum.photos/800/600?random=11&blur=1',
    'small-circuit': 'https://picsum.photos/800/600?random=12&blur=1',
    'grand-circuit': 'https://picsum.photos/800/600?random=13&blur=1',
    'banteay-srei-tour': 'https://picsum.photos/800/600?random=14&blur=1',
    'angkor-explorer': 'https://picsum.photos/800/600?random=15&blur=1',
    'jungle-adventure': 'https://picsum.photos/800/600?random=16&blur=1'
  },
  temples: {
    'angkor-wat': 'https://picsum.photos/800/600?random=21&blur=1',
    'bayon': 'https://picsum.photos/800/600?random=22&blur=1',
    'ta-prohm': 'https://picsum.photos/800/600?random=23&blur=1'
  }
};

// Get placeholder image
export const getPlaceholderImage = (
  category: keyof typeof PLACEHOLDER_IMAGES,
  key: string
): string => {
  const imageMap = PLACEHOLDER_IMAGES[category];
  return imageMap[key as keyof typeof imageMap] || 'https://picsum.photos/800/600?random=99&blur=1';
};

// Check if local image exists (for production)
export const checkImageExists = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Smart image loader with fallback
export const getImageWithFallback = async (
  category: keyof typeof PLACEHOLDER_IMAGES,
  key: string,
  localPath: string
): Promise<string> => {
  // In development, always use placeholder
  if (import.meta.env.DEV) {
    return getPlaceholderImage(category, key);
  }
  
  // In production, check if local image exists
  const imageExists = await checkImageExists(localPath);
  return imageExists ? localPath : getPlaceholderImage(category, key);
};