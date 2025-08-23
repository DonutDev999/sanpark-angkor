<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Button from 'primevue/button';

const isMenuOpen = ref(false);
const isScrolled = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/tours', label: 'Tours', icon: '🗺️' },
  { path: '/contact', label: 'Contact', icon: '📞' }
];
</script>

<template>
    <header 
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      ]"
    >
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16 lg:h-20">
                <!-- Logo/Brand -->
                <router-link 
                  to="/" 
                  class="flex items-center space-x-3 group"
                  @click="closeMenu"
                >
                    <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
                        <span class="text-white font-bold text-lg">🏛️</span>
                    </div>
                    <div class="flex flex-col">
                        <span 
                          :class="[
                            'text-lg lg:text-xl font-bold transition-colors',
                            isScrolled ? 'text-gray-900' : 'text-white'
                          ]"
                        >
                          San Park
                        </span>
                        <span 
                          :class="[
                            'text-xs font-medium transition-colors',
                            isScrolled ? 'text-orange-600' : 'text-orange-300'
                          ]"
                        >
                          Personal Angkor Guide
                        </span>
                    </div>
                </router-link>

                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center space-x-8">
                    <router-link 
                      v-for="item in navItems" 
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'relative px-3 py-2 text-sm font-medium transition-all duration-300 group',
                        isScrolled 
                          ? 'text-gray-700 hover:text-orange-600' 
                          : 'text-white hover:text-orange-300'
                      ]"
                      active-class="nav-active"
                    >
                        <span class="flex items-center space-x-2">
                            <span class="text-base">{{ item.icon }}</span>
                            <span>{{ item.label }}</span>
                        </span>
                        <!-- Active indicator -->
                        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                    </router-link>
                </nav>

                <!-- CTA Button (Desktop) -->
                <div class="hidden lg:flex items-center space-x-4">
                    <router-link to="/tours">
                        <Button 
                          label="Book Now" 
                          :severity="isScrolled ? 'warning' : undefined"
                          :outlined="!isScrolled"
                          size="small"
                          :class="[
                            'px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
                            !isScrolled ? 'navbar-book-button' : ''
                          ]"
                        />
                    </router-link>
                </div>

                <!-- Mobile Menu Button -->
                <button 
                  @click="toggleMenu"
                  :class="[
                    'lg:hidden p-2 rounded-lg transition-all duration-300',
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  ]"
                  aria-label="Toggle menu"
                >
                    <div class="w-6 h-6 flex flex-col justify-center items-center">
                        <span 
                          :class="[
                            'block w-5 h-0.5 transition-all duration-300',
                            isScrolled ? 'bg-gray-700' : 'bg-white',
                            isMenuOpen ? 'rotate-45 translate-y-1' : ''
                          ]"
                        ></span>
                        <span 
                          :class="[
                            'block w-5 h-0.5 mt-1 transition-all duration-300',
                            isScrolled ? 'bg-gray-700' : 'bg-white',
                            isMenuOpen ? 'opacity-0' : ''
                          ]"
                        ></span>
                        <span 
                          :class="[
                            'block w-5 h-0.5 mt-1 transition-all duration-300',
                            isScrolled ? 'bg-gray-700' : 'bg-white',
                            isMenuOpen ? '-rotate-45 -translate-y-1' : ''
                          ]"
                        ></span>
                    </div>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div 
          :class="[
            'lg:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden',
            isMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0'
          ]"
        >
            <div class="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
                <nav class="container mx-auto px-4 py-4">
                    <div class="flex flex-col space-y-2">
                        <router-link 
                          v-for="item in navItems" 
                          :key="item.path"
                          :to="item.path"
                          @click="closeMenu"
                          class="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                          active-class="bg-orange-100 text-orange-600"
                        >
                            <span class="text-lg">{{ item.icon }}</span>
                            <span class="font-medium">{{ item.label }}</span>
                        </router-link>
                        
                        <!-- Mobile CTA -->
                        <div class="pt-4 border-t border-gray-200">
                            <router-link to="/tours" @click="closeMenu">
                                <Button 
                                  label="Book Your Tour" 
                                  severity="warning" 
                                  size="large"
                                  class="w-full justify-center font-semibold"
                                />
                            </router-link>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* Active navigation link styling */
.nav-active {
    color: #ea580c !important;
}

.nav-active span:last-child {
    width: 100% !important;
}

/* Logo hover effects */
.group:hover .group-hover\:shadow-xl {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Smooth transitions for all interactive elements */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile menu animation */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.mobile-menu-enter {
    animation: slideDown 0.3s ease-out;
}

/* Backdrop blur support */
.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

/* Enhanced button styling */
.p-button {
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.025em;
}

/* Navbar Book Button - White styling before scroll */
.navbar-book-button.p-button {
    background-color: transparent !important;
    border: 2px solid rgba(255, 255, 255, 0.5) !important;
    color: white !important;
    backdrop-filter: blur(4px) !important;
}

.navbar-book-button.p-button:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.7) !important;
    color: white !important;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

/* Ensure proper z-index layering */
.z-50 {
    z-index: 50;
}

/* Custom scrollbar for mobile menu if needed */
.mobile-menu::-webkit-scrollbar {
    width: 4px;
}

.mobile-menu::-webkit-scrollbar-track {
    background: transparent;
}

.mobile-menu::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
}
</style>
