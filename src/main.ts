import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { initializePerformanceOptimizations } from './utils/performance'

// Initialize performance optimizations
initializePerformanceOptimizations();

const app = createApp(App);
const pinia = createPinia()

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark-mode',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
});

app.use(pinia)
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info);
  // In production, you might want to send this to an error reporting service
};

// Performance mark
performance.mark('app-mount-start');

app.mount('#app')

performance.mark('app-mount-end');
performance.measure('app-mount', 'app-mount-start', 'app-mount-end');
