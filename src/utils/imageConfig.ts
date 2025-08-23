// Image configuration and helper functions
export interface ImageConfig {
  hero: string;
  tour: string;
  temple: string;
  thumbnail: string;
}

export const IMAGE_SIZES: ImageConfig = {
  hero: '1920x1080',
  tour: '800x600', 
  temple: '800x600',
  thumbnail: '400x300'
};

export const IMAGE_BASE_PATH = '/images';

// Image helper functions
export const getImagePath = (category: keyof ImageConfig, filename: string): string => {
  return `${IMAGE_BASE_PATH}/${category}/${filename}`;
};

export const getOptimizedImagePath = (
  category: keyof ImageConfig, 
  filename: string, 
  format: 'webp' | 'jpg' = 'webp'
): string => {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  return `${IMAGE_BASE_PATH}/${category}/${nameWithoutExt}.${format}`;
};

// Fallback image helper
export const getImageWithFallback = (
  category: keyof ImageConfig,
  filename: string
): string => {
  const webpPath = getOptimizedImagePath(category, filename, 'webp');
  const jpgPath = getOptimizedImagePath(category, filename, 'jpg');
  
  // Return webp with jpg fallback
  return webpPath;
};

// Temple image mappings
export const TEMPLE_IMAGES = {
  hero: {
    'angkor-wat-sunrise': 'angkor-wat-sunrise-1920.webp',
    'bayon-temple': 'bayon-temple-1920.webp',
    'ta-prohm': 'ta-prohm-1920.webp',
    'angkor-reflection': 'angkor-reflection-1920.webp',
    'banteay-srei': 'banteay-srei-1920.webp'
  },
  tours: {
    'sunrise-tour': 'angkor-wat-sunrise-800.webp',
    'small-circuit': 'bayon-temple-800.webp',
    'grand-circuit': 'ta-prohm-800.webp',
    'banteay-srei-tour': 'banteay-srei-800.webp',
    'angkor-explorer': 'angkor-reflection-800.webp',
    'jungle-adventure': 'jungle-temple-800.webp'
  },
  temples: {
    'angkor-wat': 'angkor-wat-detail-800.webp',
    'bayon': 'bayon-faces-800.webp',
    'ta-prohm': 'ta-prohm-roots-800.webp'
  }
};

// Get temple image by key
export const getTempleImage = (
  category: keyof typeof TEMPLE_IMAGES,
  key: string
): string => {
  const imageMap = TEMPLE_IMAGES[category];
  const filename = imageMap[key as keyof typeof imageMap];
  
  if (!filename) {
    console.warn(`Image not found for ${category}/${key}, using fallback`);
    return `${IMAGE_BASE_PATH}/placeholder-${category}.jpg`;
  }
  
  return getImagePath(category, filename);
};