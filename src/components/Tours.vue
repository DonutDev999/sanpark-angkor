<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useTourStore } from '../stores/tourStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import { updatePageSEO } from '../utils/seo';
import axios from 'axios';

const tourStore = useTourStore();

// Local state for UI feedback
const isBooking = ref(false);
const bookingError = ref('');
const bookingSuccess = ref('');

// Booking dialog state
const showBookingDialog = ref(false);
const selectedTour = ref(null);
const currentStep = ref(1);
const totalSteps = 3;

// Contact form data
const bookingForm = ref({
  name: '',
  email: '',
  phone: '',
  preferredDate: null,
  numberOfPeople: 1,
  specialRequests: '',
  contactMethod: 'whatsapp'
});

// Form validation
const formErrors = ref({});

// Contact method options
const contactMethods = [
  { label: 'WhatsApp', value: 'whatsapp', icon: '📱' },
  { label: 'Email', value: 'email', icon: '📧' },
  { label: 'Phone Call', value: 'phone', icon: '📞' }
];

// Number of people options
const peopleOptions = Array.from({ length: 20 }, (_, i) => ({
  label: `${i + 1} ${i === 0 ? 'Person' : 'People'}`,
  value: i + 1
}));

// Filter and search state
const searchQuery = ref('');
const selectedDuration = ref(null);
const selectedPriceRange = ref(null);
const sortBy = ref('popularity');

// Filter options
const durationOptions = [
  { label: 'All Durations', value: null },
  { label: 'Half-day', value: 'Half-day' },
  { label: 'Full-day', value: 'Full-day' },
  { label: 'Multi-day', value: 'Multi-day' }
];

const priceRangeOptions = [
  { label: 'All Prices', value: null },
  { label: 'Under $50', value: 'under-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: 'Over $100', value: 'over-100' }
];

const sortOptions = [
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Duration', value: 'duration' }
];

// Computed filtered and sorted tours
const filteredTours = computed(() => {
  let tours = [...tourStore.tours];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    tours = tours.filter(tour => 
      tour.title.toLowerCase().includes(query) ||
      tour.description.toLowerCase().includes(query)
    );
  }

  // Duration filter
  if (selectedDuration.value) {
    tours = tours.filter(tour => tour.duration === selectedDuration.value);
  }

  // Price range filter
  if (selectedPriceRange.value) {
    tours = tours.filter(tour => {
      switch (selectedPriceRange.value) {
        case 'under-50':
          return tour.price < 50;
        case '50-100':
          return tour.price >= 50 && tour.price <= 100;
        case 'over-100':
          return tour.price > 100;
        default:
          return true;
      }
    });
  }

  // Sort tours
  tours.sort((a, b) => {
    switch (sortBy.value) {
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'duration':
        const durationOrder = { 'Half-day': 1, 'Full-day': 2, 'Multi-day': 3 };
        return (durationOrder[a.duration] || 0) - (durationOrder[b.duration] || 0);
      default:
        return 0;
    }
  });

  return tours;
});

// Statistics
const tourStats = computed(() => ({
  total: tourStore.tours.length,
  halfDay: tourStore.tours.filter(t => t.duration === 'Half-day').length,
  fullDay: tourStore.tours.filter(t => t.duration === 'Full-day').length,
  multiDay: tourStore.tours.filter(t => t.duration === 'Multi-day').length,
  avgPrice: Math.round(tourStore.tours.reduce((sum, t) => sum + t.price, 0) / tourStore.tours.length || 0)
}));

onMounted(() => {
  // Update SEO for tours page
  updatePageSEO('tours');
  
  // Load tours data
  tourStore.fetchTours();
});

// Open booking dialog
const openBookingDialog = (tour) => {
    selectedTour.value = tour;
    showBookingDialog.value = true;
    currentStep.value = 1;
    resetForm();
};

// Close booking dialog
const closeBookingDialog = () => {
    showBookingDialog.value = false;
    selectedTour.value = null;
    currentStep.value = 1;
    resetForm();
};

// Reset form
const resetForm = () => {
    bookingForm.value = {
        name: '',
        email: '',
        phone: '',
        preferredDate: null,
        numberOfPeople: 1,
        specialRequests: '',
        contactMethod: 'whatsapp'
    };
    formErrors.value = {};
};

// Step navigation
const nextStep = () => {
    if (validateCurrentStep()) {
        currentStep.value = Math.min(currentStep.value + 1, totalSteps);
    }
};

const prevStep = () => {
    currentStep.value = Math.max(currentStep.value - 1, 1);
};

const goToStep = (step) => {
    if (step <= currentStep.value || validateStepsUpTo(step - 1)) {
        currentStep.value = step;
    }
};

// Validate current step
const validateCurrentStep = () => {
    const errors = {};
    
    if (currentStep.value === 1) {
        // Step 1: Personal Information
        if (!bookingForm.value.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!bookingForm.value.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(bookingForm.value.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!bookingForm.value.phone.trim()) {
            errors.phone = 'Phone number is required';
        }
    } else if (currentStep.value === 2) {
        // Step 2: Tour Details
        if (!bookingForm.value.preferredDate) {
            errors.preferredDate = 'Please select your preferred date';
        }
    }
    
    formErrors.value = errors;
    return Object.keys(errors).length === 0;
};

// Validate steps up to a certain point
const validateStepsUpTo = (step) => {
    const currentStepBackup = currentStep.value;
    let isValid = true;
    
    for (let i = 1; i <= step; i++) {
        currentStep.value = i;
        if (!validateCurrentStep()) {
            isValid = false;
            break;
        }
    }
    
    currentStep.value = currentStepBackup;
    return isValid;
};

// Get step title
const getStepTitle = (step) => {
    switch (step) {
        case 1: return 'Personal Information';
        case 2: return 'Tour Details';
        case 3: return 'Review & Contact';
        default: return '';
    }
};

// Get step icon
const getStepIcon = (step) => {
    switch (step) {
        case 1: return '👤';
        case 2: return '📅';
        case 3: return '📞';
        default: return '';
    }
};

// Validate form
const validateForm = () => {
    const errors = {};
    
    if (!bookingForm.value.name.trim()) {
        errors.name = 'Name is required';
    }
    
    if (!bookingForm.value.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingForm.value.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!bookingForm.value.phone.trim()) {
        errors.phone = 'Phone number is required';
    }
    
    if (!bookingForm.value.preferredDate) {
        errors.preferredDate = 'Please select your preferred date';
    }
    
    formErrors.value = errors;
    return Object.keys(errors).length === 0;
};

// Submit booking request
const submitBookingRequest = async () => {
    if (!validateForm()) {
        return;
    }
    
    isBooking.value = true;
    bookingError.value = '';
    bookingSuccess.value = '';
    
    try {
        const bookingData = {
            tour: selectedTour.value,
            contact: bookingForm.value,
            requestDate: new Date().toISOString()
        };
        
        // Create contact message based on preferred method
        const message = createContactMessage(bookingData);
        
        // Handle different contact methods
        if (bookingForm.value.contactMethod === 'whatsapp') {
            const whatsappUrl = `https://wa.me/85512788354?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } else if (bookingForm.value.contactMethod === 'email') {
            const emailUrl = `mailto:sanpark@angkortours.com?subject=Tour Booking Request - ${selectedTour.value.title}&body=${encodeURIComponent(message)}`;
            window.open(emailUrl, '_blank');
        } else {
            // For phone, just show the number
            alert(`Please call us at +855 12 788 354 to discuss your booking for ${selectedTour.value.title}`);
        }
        
        bookingSuccess.value = `Booking request sent successfully! We'll contact you soon to confirm your ${selectedTour.value.title} tour and arrange payment during your appointment.`;
        closeBookingDialog();
        
    } catch (error) {
        console.error('Error sending booking request:', error);
        bookingError.value = 'Unable to send booking request. Please try again or contact us directly.';
    } finally {
        isBooking.value = false;
    }
};

// Create contact message
const createContactMessage = (bookingData) => {
    const { tour, contact } = bookingData;
    const date = contact.preferredDate ? new Date(contact.preferredDate).toLocaleDateString() : 'To be discussed';
    
    return `Hello San Park! I would like to book the following tour:

Tour: ${tour.title}
Price: $${tour.price} per person
Duration: ${tour.duration}
Number of People: ${contact.numberOfPeople}
Preferred Date: ${date}

Contact Information:
Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone}
Preferred Contact Method: ${contact.contactMethod}

${contact.specialRequests ? `Special Requests: ${contact.specialRequests}\n\n` : ''}Please confirm availability and we can arrange payment during our appointment. Looking forward to exploring Angkor with you!`;
};

// Get minimum date (tomorrow)
const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedDuration.value = null;
  selectedPriceRange.value = null;
  sortBy.value = 'popularity';
};

const getDurationIcon = (duration: string) => {
  switch (duration) {
    case 'Half-day': return '🌅';
    case 'Full-day': return '☀️';
    case 'Multi-day': return '🌄';
    default: return '⏰';
  }
};

const getDurationColor = (duration: string) => {
  switch (duration) {
    case 'Half-day': return 'bg-blue-100 text-blue-800';
    case 'Full-day': return 'bg-green-100 text-green-800';
    case 'Multi-day': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-20">
            <div class="container mx-auto px-4 text-center">
                <h1 class="text-5xl md:text-6xl font-bold mb-6">
                    Discover <span class="text-yellow-300">Angkor</span> with San Park
                </h1>
                <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                    Professional licensed guide offering authentic temple experiences in Cambodia's ancient wonder
                </p>
                
                <!-- Quick Stats -->
                <div v-if="!tourStore.isLoading && tourStore.tours.length > 0" 
                     class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-300">{{ tourStats.total }}</div>
                        <div class="text-sm opacity-90">Tours Available</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-300">${{ tourStats.avgPrice }}</div>
                        <div class="text-sm opacity-90">Average Price</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-300">4.9</div>
                        <div class="text-sm opacity-90">Rating</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-300">10K+</div>
                        <div class="text-sm opacity-90">Happy Visitors</div>
                    </div>
                </div>
            </div>
        </section>

        <div class="container mx-auto px-4 py-8">
            <!-- Feedback Messages -->
            <div v-if="bookingSuccess" class="mb-6">
                <Message severity="success" :closable="true" @close="bookingSuccess = ''">
                    {{ bookingSuccess }}
                </Message>
            </div>
            
            <div v-if="bookingError" class="mb-6">
                <Message severity="error" :closable="true" @close="bookingError = ''">
                    {{ bookingError }}
                </Message>
            </div>

            <!-- Loading State -->
            <div v-if="tourStore.isLoading" class="flex justify-center items-center py-20">
                <ProgressSpinner />
                <span class="ml-3 text-gray-600">Loading amazing tours...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="tourStore.error" class="text-center py-20">
                <Message severity="error" class="mb-4">
                    {{ tourStore.error }}
                </Message>
                <Button label="Retry" @click="tourStore.fetchTours()" outlined />
            </div>

            <!-- Main Content -->
            <div v-else-if="tourStore.tours.length > 0">
                <!-- Filters and Search Section -->
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div class="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
                        <h2 class="text-2xl font-bold text-gray-900">
                            Explore Our Tours
                            <span class="text-lg font-normal text-gray-500">({{ filteredTours.length }} tours)</span>
                        </h2>
                        
                        <Button 
                            v-if="searchQuery || selectedDuration || selectedPriceRange || sortBy !== 'popularity'"
                            label="Clear Filters" 
                            outlined 
                            size="small"
                            @click="clearFilters"
                            class="text-amber-600 border-amber-600 hover:bg-amber-50"
                        />
                    </div>

                    <!-- Filter Controls -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Search -->
                        <div class="relative">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Search Tours</label>
                            <InputText 
                                v-model="searchQuery" 
                                placeholder="Search by name or description..."
                                class="w-full"
                            />
                        </div>

                        <!-- Duration Filter -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                            <Dropdown 
                                v-model="selectedDuration" 
                                :options="durationOptions" 
                                optionLabel="label" 
                                optionValue="value"
                                placeholder="All Durations"
                                class="w-full"
                            />
                        </div>

                        <!-- Price Range Filter -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                            <Dropdown 
                                v-model="selectedPriceRange" 
                                :options="priceRangeOptions" 
                                optionLabel="label" 
                                optionValue="value"
                                placeholder="All Prices"
                                class="w-full"
                            />
                        </div>

                        <!-- Sort -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <Dropdown 
                                v-model="sortBy" 
                                :options="sortOptions" 
                                optionLabel="label" 
                                optionValue="value"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>

                <!-- Tours Grid -->
                <div v-if="filteredTours.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <article v-for="tour in filteredTours" :key="tour.id" class="tour-card">
                        <Card class="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
                            <template #header>
                                <div class="relative overflow-hidden">
                                    <img 
                                        :src="tour.image" 
                                        :alt="`${tour.title} - Angkor temple tour`" 
                                        class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                                        loading="lazy"
                                        @error="$event.target.src = 'https://via.placeholder.com/800x600?text=Tour+Image'"
                                    >
                                    
                                    <!-- Price Badge -->
                                    <div class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                                        ${{ tour.price }}
                                    </div>
                                    
                                    <!-- Popularity Stars -->
                                    <div v-if="tour.popularity" class="absolute top-4 left-4 flex bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                                        <span v-for="i in tour.popularity" :key="i" class="text-yellow-400 text-sm" aria-hidden="true">⭐</span>
                                        <span class="sr-only">{{ tour.popularity }} star rating</span>
                                    </div>

                                    <!-- Duration Badge -->
                                    <div class="absolute bottom-4 left-4">
                                        <span :class="getDurationColor(tour.duration)" 
                                              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium">
                                            <span>{{ getDurationIcon(tour.duration) }}</span>
                                            {{ tour.duration }}
                                        </span>
                                    </div>

                                    <!-- Overlay -->
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </template>
                            
                            <template #title>
                                <h2 class="text-xl font-bold mb-3 text-gray-900 leading-tight">{{ tour.title }}</h2>
                            </template>
                            
                            <template #content>
                                <p class="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{{ tour.description }}</p>
                                
                                <!-- Tour Details -->
                                <div class="flex justify-between items-center mb-4 text-sm text-gray-500">
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {{ tour.duration }}
                                    </span>
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        Private Guide
                                    </span>
                                </div>
                            </template>
                            
                            <template #footer>
                                <Button 
                                    label="Request Booking" 
                                    @click="openBookingDialog(tour)"
                                    class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    :aria-label="`Request booking for ${tour.title} tour`"
                                />
                            </template>
                        </Card>
                    </article>
                </div>

                <!-- No Results -->
                <div v-else class="text-center py-20">
                    <div class="text-6xl mb-4">🔍</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">No Tours Found</h2>
                    <p class="text-gray-600 mb-6">Try adjusting your filters to find the perfect tour for you.</p>
                    <Button label="Clear Filters" @click="clearFilters" outlined />
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <div class="text-6xl mb-4">🏛️</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">No Tours Available</h2>
                <p class="text-gray-600 mb-6">I'm currently updating my tour offerings. Please check back soon!</p>
                <Button label="Contact Us" @click="$router.push('/contact')" outlined />
            </div>
        </div>

        <!-- Enhanced Booking Dialog -->
        <Dialog 
            v-model:visible="showBookingDialog" 
            :header="null"
            :modal="true" 
            :closable="false"
            :draggable="false"
            class="booking-dialog"
            :style="{ width: '95vw', maxWidth: '800px' }"
        >
            <div v-if="selectedTour" class="booking-container">
                <!-- Custom Header -->
                <div class="booking-header">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span class="text-2xl">🏛️</span>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-white">Book Your Adventure</h2>
                                <p class="text-white/80 text-sm">{{ selectedTour.title }}</p>
                            </div>
                        </div>
                        <button 
                            @click="closeBookingDialog"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Progress Steps -->
                <div class="step-indicator">
                    <div class="flex items-center justify-between relative">
                        <!-- Progress Line -->
                        <div class="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
                            <div 
                                class="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                :style="{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }"
                            ></div>
                        </div>
                        
                        <!-- Step Circles -->
                        <div 
                            v-for="step in totalSteps" 
                            :key="step"
                            @click="goToStep(step)"
                            :class="[
                                'relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-300',
                                step <= currentStep 
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                                    : 'bg-white border-2 border-gray-300 text-gray-400 hover:border-amber-300'
                            ]"
                        >
                            <span v-if="step < currentStep" class="text-lg">✓</span>
                            <span v-else class="text-lg">{{ getStepIcon(step) }}</span>
                        </div>
                    </div>
                    
                    <!-- Step Labels -->
                    <div class="flex justify-between mt-3">
                        <div 
                            v-for="step in totalSteps" 
                            :key="`label-${step}`"
                            :class="[
                                'text-center text-sm font-medium transition-colors',
                                step <= currentStep ? 'text-amber-600' : 'text-gray-400'
                            ]"
                        >
                            {{ getStepTitle(step) }}
                        </div>
                    </div>
                </div>

                <!-- Tour Summary Card -->
                <div class="tour-summary-card">
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <img 
                                :src="selectedTour.image" 
                                :alt="selectedTour.title"
                                class="w-16 h-16 object-cover rounded-xl"
                            >
                            <div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                ${{ selectedTour.price }}
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-900 mb-1">{{ selectedTour.title }}</h3>
                            <div class="flex items-center gap-4 text-sm text-gray-600">
                                <span class="flex items-center gap-1">
                                    {{ getDurationIcon(selectedTour.duration) }} {{ selectedTour.duration }}
                                </span>
                                <span class="flex items-center gap-1">
                                    👥 {{ bookingForm.numberOfPeople }} {{ bookingForm.numberOfPeople === 1 ? 'person' : 'people' }}
                                </span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-green-600">
                                ${{ (selectedTour.price * bookingForm.numberOfPeople).toLocaleString() }}
                            </div>
                            <div class="text-xs text-gray-500">Total Estimate</div>
                        </div>
                    </div>
                </div>

                <!-- Step Content -->
                <div class="step-content">
                    <!-- Step 1: Personal Information -->
                    <div v-if="currentStep === 1" class="step-panel">
                        <div class="step-header">
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tell us about yourself</h3>
                            <p class="text-gray-600 text-sm">We need your contact information to confirm your booking</p>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group has-icon" data-icon="👤" :class="{ success: bookingForm.name && !formErrors.name }">
                                <label class="form-label">
                                    Full Name <span class="text-red-500">*</span>
                                </label>
                                <InputText 
                                    v-model="bookingForm.name"
                                    placeholder="Enter your full name"
                                    :class="{ 'p-invalid': formErrors.name }"
                                    class="form-input"
                                />
                                <small v-if="formErrors.name" class="error-message">{{ formErrors.name }}</small>
                            </div>

                            <div class="form-group has-icon" data-icon="📧" :class="{ success: bookingForm.email && !formErrors.email }">
                                <label class="form-label">
                                    Email Address <span class="text-red-500">*</span>
                                </label>
                                <InputText 
                                    v-model="bookingForm.email"
                                    type="email"
                                    placeholder="your@email.com"
                                    :class="{ 'p-invalid': formErrors.email }"
                                    class="form-input"
                                />
                                <small v-if="formErrors.email" class="error-message">{{ formErrors.email }}</small>
                            </div>

                            <div class="form-group has-icon" data-icon="📱" :class="{ success: bookingForm.phone && !formErrors.phone }">
                                <label class="form-label">
                                    Phone Number <span class="text-red-500">*</span>
                                </label>
                                <InputText 
                                    v-model="bookingForm.phone"
                                    placeholder="+855 12 345 678"
                                    :class="{ 'p-invalid': formErrors.phone }"
                                    class="form-input"
                                />
                                <small v-if="formErrors.phone" class="error-message">{{ formErrors.phone }}</small>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Preferred Contact Method</label>
                                <Dropdown 
                                    v-model="bookingForm.contactMethod"
                                    :options="contactMethods"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Choose contact method"
                                    class="form-input"
                                >
                                    <template #option="{ option }">
                                        <div class="flex items-center gap-3 p-2">
                                            <span class="text-lg">{{ option.icon }}</span>
                                            <div>
                                                <div class="font-medium">{{ option.label }}</div>
                                                <div class="text-xs text-gray-500">
                                                    {{ option.value === 'whatsapp' ? 'Instant messaging' : 
                                                       option.value === 'email' ? 'Email communication' : 'Direct phone call' }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #value="{ value }">
                                        <div v-if="value" class="flex items-center gap-2">
                                            <span class="text-lg">{{ contactMethods.find(m => m.value === value)?.icon }}</span>
                                            <span class="font-medium">{{ contactMethods.find(m => m.value === value)?.label }}</span>
                                        </div>
                                    </template>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Tour Details -->
                    <div v-if="currentStep === 2" class="step-panel">
                        <div class="step-header">
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Plan your visit</h3>
                            <p class="text-gray-600 text-sm">Choose your preferred date and group size</p>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group" :class="{ success: bookingForm.preferredDate && !formErrors.preferredDate }">
                                <label class="form-label">
                                    Preferred Date <span class="text-red-500">*</span>
                                </label>
                                <Calendar 
                                    v-model="bookingForm.preferredDate"
                                    :minDate="getMinDate()"
                                    placeholder="Select your preferred date"
                                    :class="{ 'p-invalid': formErrors.preferredDate }"
                                    class="form-input"
                                    dateFormat="dd/mm/yy"
                                    :showIcon="true"
                                    :showButtonBar="true"
                                    :numberOfMonths="1"
                                    :inline="false"
                                />
                                <small v-if="formErrors.preferredDate" class="error-message">{{ formErrors.preferredDate }}</small>
                                <small v-else class="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                    <span>💡</span>
                                    <span>Best times: Early morning for sunrise tours, afternoon for temple exploration</span>
                                </small>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Number of People</label>
                                <Dropdown 
                                    v-model="bookingForm.numberOfPeople"
                                    :options="peopleOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Select group size"
                                    class="form-input"
                                >
                                    <template #option="{ option }">
                                        <div class="flex items-center justify-between w-full p-2">
                                            <div class="flex items-center gap-2">
                                                <span class="text-lg">👥</span>
                                                <span class="font-medium">{{ option.label }}</span>
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                ${{ (selectedTour.price * option.value).toLocaleString() }} total
                                            </div>
                                        </div>
                                    </template>
                                    <template #value="{ value }">
                                        <div v-if="value" class="flex items-center gap-2">
                                            <span class="text-lg">👥</span>
                                            <span class="font-medium">{{ peopleOptions.find(p => p.value === value)?.label }}</span>
                                        </div>
                                    </template>
                                </Dropdown>
                                <small class="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                    <span>💰</span>
                                    <span>Price updates automatically based on group size</span>
                                </small>
                            </div>

                            <div class="form-group col-span-2">
                                <label class="form-label">Special Requests or Questions</label>
                                <Textarea 
                                    v-model="bookingForm.specialRequests"
                                    placeholder="Tell us about any dietary restrictions, mobility needs, photography interests, or special occasions we should know about..."
                                    rows="4"
                                    class="form-input"
                                    :autoResize="true"
                                />
                                <small class="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                    <span>✨</span>
                                    <span>Help us personalize your experience - mention any special interests or requirements</span>
                                </small>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Review & Contact -->
                    <div v-if="currentStep === 3" class="step-panel">
                        <div class="step-header">
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Review your booking</h3>
                            <p class="text-gray-600 text-sm">Confirm your details and send your booking request</p>
                        </div>
                        
                        <div class="review-section">
                            <!-- Personal Info Review -->
                            <div class="review-card">
                                <div class="review-header">
                                    <span class="review-icon">👤</span>
                                    <h4 class="review-title">Contact Information</h4>
                                    <button @click="goToStep(1)" class="edit-button">Edit</button>
                                </div>
                                <div class="review-content">
                                    <p><strong>Name:</strong> {{ bookingForm.name }}</p>
                                    <p><strong>Email:</strong> {{ bookingForm.email }}</p>
                                    <p><strong>Phone:</strong> {{ bookingForm.phone }}</p>
                                    <p><strong>Contact via:</strong> {{ contactMethods.find(m => m.value === bookingForm.contactMethod)?.label }}</p>
                                </div>
                            </div>

                            <!-- Tour Details Review -->
                            <div class="review-card">
                                <div class="review-header">
                                    <span class="review-icon">📅</span>
                                    <h4 class="review-title">Tour Details</h4>
                                    <button @click="goToStep(2)" class="edit-button">Edit</button>
                                </div>
                                <div class="review-content">
                                    <p><strong>Date:</strong> {{ bookingForm.preferredDate ? new Date(bookingForm.preferredDate).toLocaleDateString() : 'Not selected' }}</p>
                                    <p><strong>Group Size:</strong> {{ bookingForm.numberOfPeople }} {{ bookingForm.numberOfPeople === 1 ? 'person' : 'people' }}</p>
                                    <p v-if="bookingForm.specialRequests"><strong>Special Requests:</strong> {{ bookingForm.specialRequests }}</p>
                                </div>
                            </div>

                            <!-- Payment Info -->
                            <div class="payment-info">
                                <div class="flex items-center gap-3 mb-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600">💡</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Payment Information</h4>
                                        <p class="text-sm text-gray-600">No payment required now</p>
                                    </div>
                                </div>
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p class="text-sm text-blue-800">
                                        We'll contact you to confirm availability and arrange payment during your appointment. 
                                        This ensures you have the flexibility to discuss any changes or special arrangements.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="dialog-footer">
                    <div class="flex justify-between">
                        <Button 
                            v-if="currentStep > 1"
                            label="Previous" 
                            outlined
                            @click="prevStep"
                            class="px-6"
                        />
                        <div v-else></div>
                        
                        <div class="flex gap-3">
                            <Button 
                                label="Cancel" 
                                outlined
                                severity="secondary"
                                @click="closeBookingDialog"
                            />
                            <Button 
                                v-if="currentStep < totalSteps"
                                label="Next Step"
                                @click="nextStep"
                                class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none px-6"
                            />
                            <Button 
                                v-else
                                :label="isBooking ? 'Sending Request...' : 'Send Booking Request'"
                                :loading="isBooking"
                                :disabled="isBooking"
                                @click="submitBookingRequest"
                                class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none px-6"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
/* ===== GLOBAL STYLES ===== */
.min-h-screen {
  min-height: 100vh;
}

/* ===== HERO SECTION ===== */
.bg-gradient-to-r {
  background: linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%);
}

/* ===== TOUR CARDS ===== */
.tour-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tour-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.tour-card .p-card {
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tour-card:hover .p-card {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* ===== FILTER SECTION ===== */
.bg-white {
  background-color: white;
  border: 1px solid rgba(229, 231, 235, 0.5);
}

/* ===== TEXT UTILITIES ===== */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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

/* ===== ENHANCED BUTTON STYLING ===== */
.p-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  letter-spacing: 0.025em;
}

.p-button:hover {
  transform: translateY(-2px);
}

.p-button.p-button-outlined {
  border-width: 2px;
}

/* ===== FORM CONTROLS ===== */
.p-inputtext,
.p-dropdown {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.p-inputtext:focus,
.p-dropdown:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.p-dropdown-panel {
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* ===== BADGES AND LABELS ===== */
.bg-green-500 {
  background-color: #10b981 !important;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-800 {
  color: #166534;
}

.bg-purple-100 {
  background-color: #f3e8ff;
}

.text-purple-800 {
  color: #6b21a8;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.text-gray-800 {
  color: #1f2937;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tour-card {
  animation: fadeInUp 0.6s ease-out;
}

.tour-card:nth-child(1) { animation-delay: 0.1s; }
.tour-card:nth-child(2) { animation-delay: 0.2s; }
.tour-card:nth-child(3) { animation-delay: 0.3s; }
.tour-card:nth-child(4) { animation-delay: 0.4s; }
.tour-card:nth-child(5) { animation-delay: 0.5s; }
.tour-card:nth-child(6) { animation-delay: 0.6s; }

/* ===== LOADING STATES ===== */
.p-progress-spinner {
  width: 3rem;
  height: 3rem;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem !important;
    line-height: 1.1;
  }
  
  .text-xl {
    font-size: 1.1rem !important;
  }
  
  .grid {
    gap: 1rem;
  }
  
  .tour-card .p-card .p-card-header img {
    height: 200px;
  }
  
  .bg-gradient-to-r {
    padding: 3rem 0;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem !important;
  }
  
  .text-xl {
    font-size: 1rem !important;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .lg\\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .bg-gradient-to-r {
    padding: 2rem 0;
  }
  
  .py-20 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  .p-6 {
    padding: 1rem;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .tour-card,
  .p-button,
  .transition-all {
    animation: none;
    transition: none;
  }
  
  .transform {
    transform: none;
  }
}

/* ===== FOCUS STATES ===== */
.p-button:focus-visible {
  outline: 2px solid #d97706;
  outline-offset: 2px;
}

.tour-card:focus-within {
  outline: 2px solid #d97706;
  outline-offset: 2px;
  border-radius: 1rem;
}

/* ===== ENHANCED BOOKING DIALOG ===== */
.booking-dialog .p-dialog {
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.booking-dialog .p-dialog-content {
  padding: 0;
  max-height: 85vh;
  overflow-y: auto;
}

/* Booking Container */
.booking-container {
  background: white;
}

/* Custom Header */
.booking-header {
  background: linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%);
  padding: 2rem;
  color: white;
}

/* Step Indicator */
.step-indicator {
  padding: 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

/* Tour Summary Card */
.tour-summary-card {
  margin: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #f59e0b;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Step Content */
.step-content {
  padding: 2rem;
  min-height: 400px;
}

.step-panel {
  animation: fadeInSlide 0.3s ease-out;
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-header {
  margin-bottom: 2rem;
  text-align: center;
}

/* Form Styling */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-group.col-span-2 {
  grid-column: span 2;
}

.form-label {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(135deg, #d97706, #ea580c);
  border-radius: 2px;
}

/* Enhanced Input Styling */
.form-input {
  width: 100%;
  border-radius: 1rem;
  border: 2px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  padding: 1rem 1.25rem;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-input:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-input:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  outline: none;
  transform: translateY(-1px);
}

.form-input.p-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
  background-color: #fef2f2;
}

.form-input.p-invalid:focus {
  transform: none;
}

/* Input Icons */
.form-group.has-icon .form-input {
  padding-left: 3rem;
}

.form-group.has-icon::before {
  content: attr(data-icon);
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  color: #6b7280;
  z-index: 10;
  margin-top: 0.75rem;
}

/* Dropdown Enhancements */
.form-input.p-dropdown {
  padding: 0;
}

.form-input.p-dropdown .p-dropdown-label {
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
}

.form-input.p-dropdown .p-dropdown-trigger {
  width: 3rem;
  border: none;
  background: linear-gradient(135deg, #d97706, #ea580c);
  border-radius: 0 1rem 1rem 0;
}

.form-input.p-dropdown .p-dropdown-trigger .p-dropdown-trigger-icon {
  color: white;
}

/* Calendar Enhancements */
.form-input.p-calendar {
  padding: 0;
}

.form-input.p-calendar .p-inputtext {
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  border-radius: 1rem 0 0 1rem;
}

.form-input.p-calendar .p-datepicker-trigger {
  width: 3rem;
  border: none;
  background: linear-gradient(135deg, #d97706, #ea580c);
  border-radius: 0 1rem 1rem 0;
}

.form-input.p-calendar .p-datepicker-trigger .p-button-icon {
  color: white;
}

/* Textarea Enhancements */
.form-input.p-inputtextarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

.form-input.p-inputtextarea:focus {
  min-height: 140px;
}

/* Error Message Styling */
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message::before {
  content: '⚠️';
  font-size: 0.875rem;
}

/* Success State */
.form-group.success .form-input {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.form-group.success .form-input:focus {
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-group.success::after {
  content: '✓';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
  font-weight: bold;
  margin-top: 0.75rem;
}

/* Floating Labels */
.form-group.floating {
  position: relative;
}

.form-group.floating .form-label {
  position: absolute;
  left: 1.25rem;
  top: 1rem;
  background: white;
  padding: 0 0.5rem;
  transition: all 0.2s ease;
  pointer-events: none;
  color: #6b7280;
  margin: 0;
}

.form-group.floating .form-label::before {
  display: none;
}

.form-group.floating .form-input:focus + .form-label,
.form-group.floating .form-input:not(:placeholder-shown) + .form-label {
  top: -0.5rem;
  left: 1rem;
  font-size: 0.75rem;
  color: #d97706;
  font-weight: 600;
}

/* Dropdown Panel Styling */
.p-dropdown-panel {
  border-radius: 1rem;
  border: 2px solid #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.p-dropdown-panel .p-dropdown-items {
  padding: 0.5rem;
}

.p-dropdown-panel .p-dropdown-item {
  border-radius: 0.75rem;
  margin-bottom: 0.25rem;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

.p-dropdown-panel .p-dropdown-item:hover {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  transform: translateX(4px);
}

.p-dropdown-panel .p-dropdown-item.p-highlight {
  background: linear-gradient(135deg, #d97706, #ea580c);
  color: white;
}

/* Calendar Panel Styling */
.p-datepicker {
  border-radius: 1.5rem !important;
  border: 2px solid #e5e7eb !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden !important;
  background: white !important;
  z-index: 9999 !important;
  position: relative !important;
}

.p-datepicker-panel {
  background: white !important;
  z-index: 9999 !important;
  border-radius: 1.5rem !important;
  border: 2px solid #e5e7eb !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden !important;
}

.p-datepicker .p-datepicker-header {
  background: linear-gradient(135deg, #d97706, #ea580c) !important;
  color: white !important;
  padding: 1rem !important;
  border-radius: 0 !important;
}

.p-datepicker .p-datepicker-title {
  font-weight: 600 !important;
  color: white !important;
}

.p-datepicker .p-datepicker-prev,
.p-datepicker .p-datepicker-next {
  color: white !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
  background: transparent !important;
}

.p-datepicker .p-datepicker-prev:hover,
.p-datepicker .p-datepicker-next:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.1) !important;
}

.p-datepicker .p-datepicker-calendar {
  padding: 1rem !important;
  background: white !important;
}

.p-datepicker .p-datepicker-calendar td {
  padding: 0.25rem !important;
}

.p-datepicker .p-datepicker-calendar td > span {
  width: 2.5rem !important;
  height: 2.5rem !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
  font-weight: 500 !important;
  color: #374151 !important;
  background: transparent !important;
}

.p-datepicker .p-datepicker-calendar td > span:hover {
  background: #fef3c7 !important;
  transform: scale(1.1) !important;
  color: #92400e !important;
}

.p-datepicker .p-datepicker-calendar td > span.p-highlight {
  background: linear-gradient(135deg, #d97706, #ea580c) !important;
  color: white !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

.p-datepicker .p-datepicker-calendar .p-datepicker-today > span {
  background: #dbeafe !important;
  color: #1e40af !important;
  font-weight: 600 !important;
}

.p-datepicker .p-datepicker-calendar .p-datepicker-other-month > span {
  color: #9ca3af !important;
}

.p-datepicker .p-datepicker-calendar .p-datepicker-weekheader {
  background: #f8fafc !important;
}

.p-datepicker .p-datepicker-calendar .p-datepicker-weekheader th {
  color: #6b7280 !important;
  font-weight: 600 !important;
  padding: 0.5rem !important;
  font-size: 0.75rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
}

/* Review Section */
.review-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.review-card:hover {
  border-color: #d97706;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.review-icon {
  font-size: 1.5rem;
}

.review-title {
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.edit-button {
  background: #d97706;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #b45309;
  transform: translateY(-1px);
}

.review-content p {
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
}

.review-content p:last-child {
  margin-bottom: 0;
}

/* Payment Info */
.payment-info {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 1rem;
  padding: 1.5rem;
}

/* Dialog Footer */
.dialog-footer {
  padding: 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Step Navigation Enhancements */
.step-indicator .relative.z-10 {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-indicator .relative.z-10:hover {
  transform: scale(1.1);
}

/* Button Enhancements */
.booking-dialog .p-button {
  border-radius: 0.75rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.booking-dialog .p-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Helper Text Styling */
.form-group small:not(.error-message) {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 3px solid #d97706;
}

/* Input Focus Animations */
@keyframes inputFocus {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.form-input:focus {
  animation: inputFocus 0.3s ease-out;
}

/* Calendar Button Bar Styling */
.p-datepicker .p-datepicker-buttonbar {
  padding: 1rem !important;
  background: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
}

.p-datepicker .p-datepicker-buttonbar .p-button {
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
  padding: 0.5rem 1rem !important;
  margin: 0 0.25rem !important;
}

.p-datepicker .p-datepicker-buttonbar .p-button.p-button-text {
  color: #6b7280 !important;
  background: transparent !important;
  border: 1px solid #d1d5db !important;
}

.p-datepicker .p-datepicker-buttonbar .p-button.p-button-text:hover {
  background: #e5e7eb !important;
  color: #374151 !important;
  border-color: #9ca3af !important;
}

.p-datepicker .p-datepicker-buttonbar .p-button.p-button-text:focus {
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2) !important;
}

/* Enhanced Textarea */
.form-input.p-inputtextarea {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-input.p-inputtextarea::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* Dropdown Option Enhancements */
.p-dropdown-panel .p-dropdown-item {
  position: relative;
}

.p-dropdown-panel .p-dropdown-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(135deg, #d97706, #ea580c);
  border-radius: 0 2px 2px 0;
  transition: height 0.2s ease;
}

.p-dropdown-panel .p-dropdown-item:hover::before {
  height: 60%;
}

/* Form Group Animations */
.form-group {
  animation: slideInUp 0.4s ease-out;
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.form-group:nth-child(3) { animation-delay: 0.3s; }
.form-group:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-dialog .p-dialog {
    margin: 0.5rem;
    width: calc(100vw - 1rem) !important;
    max-width: none !important;
    border-radius: 1rem;
  }
  
  .booking-header {
    padding: 1.5rem;
  }
  
  .step-indicator {
    padding: 1.5rem;
  }
  
  .step-content {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .form-group.col-span-2 {
    grid-column: span 1;
  }
  
  .dialog-footer {
    padding: 1.5rem;
  }
  
  .tour-summary-card {
    margin: 1rem;
    padding: 1rem;
  }
  
  .step-indicator .flex.justify-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-indicator .relative.z-10 {
    width: 3rem;
    height: 3rem;
  }
  
  .form-group.has-icon::before {
    font-size: 1rem;
    left: 0.75rem;
  }
  
  .form-group.has-icon .form-input {
    padding-left: 2.5rem;
  }
}

@media (max-width: 480px) {
  .booking-header h2 {
    font-size: 1.125rem;
  }
  
  .step-header h3 {
    font-size: 1rem;
  }
  
  .tour-summary-card .flex {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .tour-summary-card .text-right {
    text-align: center;
  }
  
  .dialog-footer .flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .dialog-footer .flex.gap-3 {
    flex-direction: row;
  }
}

/* Loading and Animation States */
.booking-dialog .p-button .p-button-loading-icon {
  margin-right: 0.5rem;
}

/* Custom Scrollbar for Dialog Content */
.booking-dialog .p-dialog-content::-webkit-scrollbar {
  width: 6px;
}

.booking-dialog .p-dialog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.booking-dialog .p-dialog-content::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 3px;
}

.booking-dialog .p-dialog-content::-webkit-scrollbar-thumb:hover {
  background: #b45309;
}

/* ===== PRINT STYLES ===== */
@media print {
  .bg-gradient-to-r {
    background: #d97706 !important;
    color: white !important;
  }
  
  .tour-card {
    break-inside: avoid;
    margin-bottom: 1rem;
  }
  
  .booking-dialog {
    display: none !important;
  }
}
</style>
