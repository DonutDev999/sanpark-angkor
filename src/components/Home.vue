<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Rating from 'primevue/rating';
import { useTourStore } from '../stores/tourStore';
import { getTempleImage } from '../utils/imageConfig';
import { getPlaceholderImage } from '../utils/placeholderImages';
import { updatePageSEO, generateTourStructuredData, injectStructuredData } from '../utils/seo';

// ===== COMPOSABLES & STORES =====
const tourStore = useTourStore();

// ===== REACTIVE STATE =====
const isLoading = ref(true);
const activeSection = ref('hero');

// Hero Carousel State
const currentSlide = ref(0);
const isAutoPlaying = ref(true);
const carouselInterval = ref<NodeJS.Timeout | null>(null);

// Animation States
const sectionsVisible = ref<Record<string, boolean>>({
  hero: false,
  about: false,
  tours: false,
  features: false,
  temples: false,
  testimonials: false,
  cta: false
});

// ===== DATA DEFINITIONS =====

// Hero Section Data
const heroSlides = ref([
  {
    id: 1,
    imageKey: 'angkor-wat-sunrise',
    image: getPlaceholderImage('hero', 'angkor-wat-sunrise'),
    title: 'Discover Angkor Wat',
    subtitle: 'The Crown Jewel of Cambodia',
    description: 'Experience the magnificent sunrise over the world\'s largest religious monument',
    cta: 'Book Sunrise Tour',
    highlights: ['UNESCO World Heritage', 'Expert Guides', '5-Star Experience']
  },
  {
    id: 2,
    imageKey: 'bayon-temple',
    image: getPlaceholderImage('hero', 'bayon-temple'),
    title: 'Mystical Bayon Temple',
    subtitle: 'Faces of Ancient Kings',
    description: 'Marvel at the enigmatic stone faces that have watched over Cambodia for centuries',
    cta: 'Explore Bayon',
    highlights: ['216 Stone Faces', 'Angkor Thom', 'Khmer Artistry']
  },
  {
    id: 3,
    imageKey: 'ta-prohm',
    image: getPlaceholderImage('hero', 'ta-prohm'),
    title: 'Ta Prohm Temple',
    subtitle: 'Nature Reclaims History',
    description: 'Witness the incredible fusion of ancient architecture and jungle overgrowth',
    cta: 'Jungle Tours',
    highlights: ['Tree Temples', 'Tomb Raider Fame', 'Natural Wonder']
  },
  {
    id: 4,
    imageKey: 'angkor-reflection',
    image: getPlaceholderImage('hero', 'angkor-reflection'),
    title: 'Angkor Reflection',
    subtitle: 'Mirror of Eternity',
    description: 'Capture the perfect reflection of ancient temples in tranquil waters',
    cta: 'Photo Tours',
    highlights: ['Perfect Reflections', 'Golden Hour', 'Instagram Worthy']
  },
  {
    id: 5,
    imageKey: 'banteay-srei',
    image: getPlaceholderImage('hero', 'banteay-srei'),
    title: 'Banteay Srei',
    subtitle: 'Citadel of Women',
    description: 'Admire the finest examples of classical Khmer art and intricate pink sandstone carvings',
    cta: 'Art & Culture',
    highlights: ['Pink Sandstone', 'Intricate Carvings', 'Artistic Masterpiece']
  }
]);

// Company Stats
const companyStats = ref([
  { icon: '👥', number: '10,000+', label: 'Happy Travelers', color: 'text-blue-600' },
  { icon: '🏛️', number: '50+', label: 'Temple Sites', color: 'text-amber-600' },
  { icon: '⭐', number: '4.9/5', label: 'Average Rating', color: 'text-yellow-600' },
  { icon: '🌅', number: '365', label: 'Days a Year', color: 'text-orange-600' }
]);

// Featured Tours
const featuredTours = computed(() => {
  return tourStore.tours
    .filter(tour => tour.popularity >= 4)
    .slice(0, 6);
});

// Service Features
const serviceFeatures = ref([
  {
    icon: '👨‍🏫',
    title: 'Licensed Professional Guide',
    description: 'Native Cambodian guide with official certification and deep historical knowledge',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: '🗣️',
    title: 'Multilingual Service',
    description: 'Fluent in English and Khmer, with clear explanations of temple history and culture',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: '📱',
    title: 'Easy Communication',
    description: 'Direct contact via WhatsApp for instant booking and tour coordination',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: '💰',
    title: 'Fair Pricing',
    description: 'Transparent pricing with no hidden fees and flexible payment options',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    icon: '🎯',
    title: 'Personalized Tours',
    description: 'Customized itineraries based on your interests and time availability',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: '🌟',
    title: 'Authentic Experience',
    description: 'Local insights and stories that bring ancient Khmer history to life',
    color: 'bg-indigo-50 text-indigo-600'
  }
]);

// Temple Highlights
const templeHighlights = ref([
  {
    name: 'Angkor Wat',
    imageKey: 'angkor-wat',
    image: getPlaceholderImage('temples', 'angkor-wat'),
    description: 'The largest religious monument in the world, a masterpiece of Khmer architecture',
    highlights: ['Sunrise Views', 'Intricate Carvings', 'Historical Significance'],
    bestTime: 'Sunrise (5:30 AM)'
  },
  {
    name: 'Bayon Temple',
    imageKey: 'bayon',
    image: getPlaceholderImage('temples', 'bayon'),
    description: 'Famous for its serene stone faces and rich decorative carvings',
    highlights: ['Stone Faces', 'Central Location', 'Photogenic'],
    bestTime: 'Morning (8:00 AM)'
  },
  {
    name: 'Ta Prohm',
    imageKey: 'ta-prohm',
    image: getPlaceholderImage('temples', 'ta-prohm'),
    description: 'The famous "Tomb Raider" temple, embraced by massive tree roots',
    highlights: ['Tree Roots', 'Movie Fame', 'Natural Beauty'],
    bestTime: 'Afternoon (2:00 PM)'
  }
]);

// Customer Testimonials
const testimonials = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    country: 'Australia',
    avatar: '🇦🇺',
    rating: 5,
    text: 'Absolutely incredible experience! Our guide was knowledgeable and the sunrise at Angkor Wat was breathtaking. Highly recommend!',
    tour: 'Sunrise Tour',
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Marco Silva',
    country: 'Brazil',
    avatar: '🇧🇷',
    rating: 5,
    text: 'Perfect organization and amazing temples. The Ta Prohm temple was exactly like in the movies! Professional service throughout.',
    tour: 'Grand Circuit',
    date: '2024-01-10'
  },
  {
    id: 3,
    name: 'Yuki Tanaka',
    country: 'Japan',
    avatar: '🇯🇵',
    rating: 5,
    text: 'Deep cultural insights and professional service. Our guide shared fascinating stories about Khmer history. Unforgettable experience!',
    tour: 'Cultural Tour',
    date: '2024-01-08'
  }
]);

// ===== COMPUTED PROPERTIES =====
const currentSlideData = computed(() => heroSlides.value[currentSlide.value]);

// ===== METHODS =====

// Hero Carousel Functions
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length;
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? heroSlides.value.length - 1 : currentSlide.value - 1;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  if (carouselInterval.value) return;
  carouselInterval.value = setInterval(nextSlide, 5000);
};

const stopAutoPlay = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value);
    carouselInterval.value = null;
  }
};

const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value;
  if (isAutoPlaying.value) {
    startAutoPlay();
  } else {
    stopAutoPlay();
  }
};

// Intersection Observer for animations
const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && sectionsVisible.value.hasOwnProperty(sectionId)) {
            sectionsVisible.value[sectionId] = true;
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all sections after component mounts
  setTimeout(() => {
    const sections = ['about', 'tours', 'features', 'temples', 'testimonials', 'cta'];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });
  }, 100);
};

// Navigation functions
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// ===== LIFECYCLE HOOKS =====
onMounted(async () => {
  console.log('🚀 Home page loading...');
  
  try {
    // Update SEO for home page
    updatePageSEO('home');
    
    // Load tour data
    await tourStore.fetchTours();
    
    // Inject structured data for featured tours
    if (tourStore.tours.length > 0) {
      const featuredTour = tourStore.tours.find(tour => tour.popularity >= 4);
      if (featuredTour) {
        const structuredData = generateTourStructuredData(featuredTour);
        injectStructuredData(structuredData);
      }
    }
    
    // Start hero carousel
    startAutoPlay();
    
    // Setup intersection observer for animations
    setupIntersectionObserver();
    
    // Trigger hero animation
    setTimeout(() => {
      sectionsVisible.value.hero = true;
    }, 300);
    
    // Set loading complete
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
    
    console.log('✅ Home page loaded successfully');
  } catch (error) {
    console.error('❌ Error loading home page:', error);
    // Still hide loading screen even if there's an error
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <div class="home-page">
    <!-- Loading Screen -->
    <div v-if="isLoading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading Angkor Experience...</p>
      </div>
    </div>

    <!-- Hero Section with Carousel -->
    <section id="hero" class="hero-section relative min-h-screen overflow-hidden -mt-20">
      
      <!-- Background Carousel -->
      <div class="absolute inset-0">
        <div v-for="(slide, index) in heroSlides" 
             :key="slide.id"
             :class="{ 'opacity-100': index === currentSlide, 'opacity-0': index !== currentSlide }"
             class="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
               :style="`background-image: url('${slide.image}')`">
          </div>
        </div>
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div class="max-w-6xl mx-auto text-center text-white">
          

          <!-- Dynamic Title -->
          <h1 :class="{ 'animate-fade-in-up': sectionsVisible.hero }" 
              class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-400
                     text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span class="block text-white drop-shadow-2xl">{{ currentSlideData.title }}</span>
            <span class="block bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 
                         bg-clip-text text-transparent">
              {{ currentSlideData.subtitle }}
            </span>
          </h1>

          <!-- Dynamic Description -->
          <p :class="{ 'animate-fade-in-up': sectionsVisible.hero }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-600
                    text-xl md:text-2xl mb-8 text-gray-200 font-light leading-relaxed max-w-4xl mx-auto">
            {{ currentSlideData.description }}
          </p>

          <!-- Dynamic Highlights -->
          <div :class="{ 'animate-fade-in-up': sectionsVisible.hero }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-800
                      flex flex-wrap justify-center gap-4 mb-12">
            <div v-for="highlight in currentSlideData.highlights" :key="highlight"
                 class="flex items-center gap-2 bg-white/10 backdrop-blur-sm 
                        rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 
                        transition-all duration-300 transform hover:scale-105">
              <span class="text-sm font-medium">{{ highlight }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div :class="{ 'animate-fade-in-up': sectionsVisible.hero }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-1000
                      flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <router-link to="/tours">
              <Button :label="currentSlideData.cta" 
                      class="hero-book-button px-8 py-4 text-lg font-semibold rounded-full
                             transform hover:scale-105 transition-all duration-300" />
            </router-link>
            <Button label="Learn More" 
                    outlined 
                    @click="scrollToSection('about')"
                    class="px-8 py-4 text-lg font-semibold rounded-full
                           border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm
                           transform hover:scale-105 transition-all duration-300" />
          </div>

          <!-- Company Stats -->
          <div :class="{ 'animate-fade-in-up': sectionsVisible.hero }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-1200
                      grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div v-for="stat in companyStats" :key="stat.label" 
                 class="text-center group cursor-pointer">
              <div class="text-3xl font-bold text-amber-400 mb-2 group-hover:scale-110 
                          transition-transform duration-300">
                {{ stat.number }}
              </div>
              <div class="text-sm text-gray-300 font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Controls -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4">
        <!-- Indicators -->
        <div class="flex space-x-3">
          <button v-for="(slide, index) in heroSlides" 
                  :key="slide.id"
                  @click="goToSlide(index)"
                  :class="{ 'bg-amber-400 scale-125': index === currentSlide, 'bg-white/40': index !== currentSlide }"
                  class="w-3 h-3 rounded-full transition-all duration-300 hover:bg-amber-300 hover:scale-110">
          </button>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button @click="prevSlide" 
              class="absolute left-4 top-1/2 transform -translate-y-1/2 z-20
                     p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 
                     transition-all duration-300 group">
        <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button @click="nextSlide" 
              class="absolute right-4 top-1/2 transform -translate-y-1/2 z-20
                     p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 
                     transition-all duration-300 group">
        <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 right-8 z-20 animate-bounce">
        <div class="flex flex-col items-center text-white/70">
          <span class="text-sm mb-2">Scroll</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <div :class="{ 'animate-fade-in-up': sectionsVisible.about }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Welcome to <span class="text-amber-600">San Park's</span> Angkor Tours
            </h2>
            <p class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Hi, I'm San Park, your professional licensed tour guide for the magnificent Angkor Archaeological Park. 
              With years of experience and deep knowledge of Khmer history and culture, I'll take you on an 
              unforgettable journey through the ancient temples and share the fascinating stories behind these 
              UNESCO World Heritage monuments.
            </p>
          </div>
        </div>

        <!-- Company Stats Grid -->
        <div :class="{ 'animate-fade-in-up': sectionsVisible.about }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-300
                    grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div v-for="stat in companyStats" :key="stat.label" 
               class="text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 group">
            <div class="text-4xl mb-4">{{ stat.icon }}</div>
            <div :class="stat.color" class="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">
              {{ stat.number }}
            </div>
            <div class="text-gray-600 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Tours Section -->
    <section id="tours" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <div :class="{ 'animate-fade-in-up': sectionsVisible.tours }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Featured <span class="text-amber-600">Tours</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular experiences, carefully crafted to showcase the best of Angkor's ancient wonders.
            </p>
          </div>
        </div>

        <!-- Tours Grid -->
        <div :class="{ 'animate-fade-in-up': sectionsVisible.tours }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-300
                    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card v-for="tour in featuredTours" :key="tour.id" 
                class="tour-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <template #header>
              <div class="relative overflow-hidden">
                <img :src="tour.image" :alt="tour.title" 
                     class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110">
                <Badge :value="`$${tour.price}`" severity="success" 
                       class="absolute top-4 right-4 bg-green-500 text-white" />
                <div class="absolute top-4 left-4 flex">
                  <span v-for="i in tour.popularity" :key="i" class="text-yellow-400 text-lg">⭐</span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </template>
            <template #title>
              <h3 class="text-xl font-bold mb-2 text-gray-900">{{ tour.title }}</h3>
            </template>
            <template #content>
              <p class="text-gray-600 mb-4 line-clamp-3">{{ tour.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ tour.duration }}
                </span>
                <router-link to="/tours">
                  <Button label="Book Now" severity="warning" size="small" 
                          class="bg-amber-500 hover:bg-amber-600 border-none" />
                </router-link>
              </div>
            </template>
          </Card>
        </div>

        <!-- View All Tours Button -->
        <div :class="{ 'animate-fade-in-up': sectionsVisible.tours }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-600 text-center">
          <router-link to="/tours">
            <Button label="View All Tours" outlined size="large" 
                    class="px-8 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Service Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <div :class="{ 'animate-fade-in-up': sectionsVisible.features }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why Choose <span class="text-amber-600">San Park</span> as Your Guide?
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              I'm committed to providing you with an authentic, personalized, and unforgettable experience exploring Cambodia's ancient treasures.
            </p>
          </div>
        </div>

        <!-- Features Grid -->
        <div :class="{ 'animate-fade-in-up': sectionsVisible.features }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-300
                    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in serviceFeatures" :key="feature.title" 
               class="feature-card p-8 rounded-2xl border border-gray-200 hover:border-amber-300 
                      hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div :class="feature.color" 
                 class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 
                        group-hover:scale-110 transition-transform duration-300">
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-900">{{ feature.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Temple Highlights Section -->
    <section id="temples" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <div :class="{ 'animate-fade-in-up': sectionsVisible.temples }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Iconic <span class="text-amber-600">Temples</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the most magnificent temples that showcase the architectural brilliance of the Khmer Empire.
            </p>
          </div>
        </div>

        <!-- Temples Grid -->
        <div :class="{ 'animate-fade-in-up': sectionsVisible.temples }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-300
                    grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card v-for="temple in templeHighlights" :key="temple.name" 
                class="temple-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <template #header>
              <div class="relative overflow-hidden">
                <img :src="temple.image" :alt="temple.name" 
                     class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110">
                <div class="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span class="text-white text-sm font-medium">{{ temple.bestTime }}</span>
                </div>
              </div>
            </template>
            <template #title>
              <h3 class="text-2xl font-bold mb-3 text-gray-900">{{ temple.name }}</h3>
            </template>
            <template #content>
              <p class="text-gray-600 mb-4 leading-relaxed">{{ temple.description }}</p>
              <div class="space-y-2">
                <div v-for="highlight in temple.highlights" :key="highlight" 
                     class="flex items-center text-sm text-gray-700">
                  <svg class="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ highlight }}
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <div :class="{ 'animate-fade-in-up': sectionsVisible.testimonials }" 
               class="opacity-0 transform translate-y-8 transition-all duration-1000">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              What Our <span class="text-amber-600">Travelers</span> Say
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from travelers who have experienced the magic of Angkor with us.
            </p>
          </div>
        </div>

        <!-- Testimonials Grid -->
        <div :class="{ 'animate-fade-in-up': sectionsVisible.testimonials }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-300
                    grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card v-for="testimonial in testimonials" :key="testimonial.id" 
                class="testimonial-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <template #content>
              <div class="text-center p-6">
                <div class="text-5xl mb-4">{{ testimonial.avatar }}</div>
                <Rating :modelValue="testimonial.rating" readonly :cancel="false" class="mb-4" />
                <p class="text-gray-700 italic mb-6 leading-relaxed">"{{ testimonial.text }}"</p>
                <div class="border-t pt-4">
                  <div class="font-semibold text-gray-900">{{ testimonial.name }}</div>
                  <div class="text-sm text-gray-500 mb-2">{{ testimonial.country }}</div>
                  <div class="text-xs text-amber-600 font-medium">{{ testimonial.tour }}</div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section id="cta" class="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4">
        <div :class="{ 'animate-fade-in-up': sectionsVisible.cta }" 
             class="opacity-0 transform translate-y-8 transition-all duration-1000">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Ready to Explore <span class="text-yellow-300">Angkor?</span>
          </h2>
          <p class="text-xl mb-8 leading-relaxed opacity-90">
            Join thousands of satisfied travelers and discover the ancient wonders of Cambodia. 
            Let us create an unforgettable journey through history for you.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/tours">
              <Button label="🌅 Book Your Adventure" size="large" 
                      class="px-8 py-4 bg-white text-amber-600 hover:bg-gray-100 border-none 
                             font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300" />
            </router-link>
            <router-link to="/contact">
              <Button label="💬 Contact Us" outlined size="large" 
                      class="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-amber-600 
                             font-semibold rounded-full transform hover:scale-105 transition-all duration-300" />
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== GLOBAL STYLES ===== */
.home-page {
  scroll-behavior: smooth;
}

/* ===== HERO SECTION ===== */
.hero-section {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  position: relative;
  z-index: 1;
}

/* ===== ANIMATIONS ===== */
.animate-fade-in-up {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* ===== CARD HOVER EFFECTS ===== */
.tour-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.temple-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.testimonial-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.feature-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.5rem !important;
    line-height: 1.1;
  }
  
  .hero-section p {
    font-size: 1.1rem !important;
    margin-bottom: 2rem;
  }
  
  .hero-section .grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 2rem !important;
  }
  
  .hero-section p {
    font-size: 1rem !important;
  }
  
  .hero-section .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* ===== UTILITY CLASSES ===== */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== SECTION SPACING ===== */
section {
  scroll-margin-top: 80px;
}

/* ===== HERO SECTION ADJUSTMENTS ===== */
.hero-section {
  margin-top: -80px;
  padding-top: 80px;
}

/* ===== BUTTON ENHANCEMENTS ===== */
.p-button {
  transition: all 0.3s ease;
}

.p-button:hover {
  transform: translateY(-2px);
}

/* Hero Book Button - Force white styling */
.hero-book-button.p-button {
  background-color: transparent !important;
  border: 2px solid rgba(255, 255, 255, 0.5) !important;
  color: white !important;
  backdrop-filter: blur(4px) !important;
}

.hero-book-button.p-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.7) !important;
  color: white !important;
}

.hero-book-button.p-button:focus {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.7) !important;
  color: white !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25) !important;
}

/* ===== LOADING ANIMATION ===== */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* ===== PERFORMANCE OPTIMIZATIONS ===== */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-spin,
  .transition-all {
    animation: none;
    transition: none;
  }
  
  .transform {
    transform: none;
  }
}

/* ===== ACCESSIBILITY ===== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ===== CUSTOM SCROLLBAR ===== */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b45309;
}
</style>