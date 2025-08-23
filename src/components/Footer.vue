<template>
    <footer class="bg-gray-800 text-white py-12 mt-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Company Info -->
                <div class="md:col-span-2">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                            <span class="text-white font-bold text-lg">🏛️</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white">San Park</h3>
                            <p class="text-orange-300 text-sm">Personal Angkor Tour Guide</p>
                        </div>
                    </div>
                    <p class="text-gray-300 mb-4 leading-relaxed">
                        Experience the wonders of Angkor with me, San Park, your professional licensed guide. 
                        I'm passionate about sharing Cambodia's rich heritage and creating unforgettable memories.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://wa.me/85512788354" target="_blank" rel="noopener noreferrer" 
                           class="text-gray-300 hover:text-green-400 transition-colors">
                            <span class="text-2xl">💬</span>
                        </a>
                        <a href="mailto:Sanpark.angkor@googlemail.com" 
                           class="text-gray-300 hover:text-blue-400 transition-colors">
                            <span class="text-2xl">📧</span>
                        </a>
                        <a href="tel:+85512788354" 
                           class="text-gray-300 hover:text-yellow-400 transition-colors">
                            <span class="text-2xl">📞</span>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-orange-300">Quick Links</h4>
                    <ul class="space-y-2">
                        <li><router-link to="/" class="text-gray-300 hover:text-white transition-colors">Home</router-link></li>
                        <li><router-link to="/tours" class="text-gray-300 hover:text-white transition-colors">Tours</router-link></li>
                        <li><router-link to="/contact" class="text-gray-300 hover:text-white transition-colors">Contact</router-link></li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-orange-300">Contact Info</h4>
                    <div class="space-y-3 text-gray-300">
                        <div class="flex items-center space-x-2">
                            <span>📞</span>
                            <span>+855 12 788 354</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>📧</span>
                            <span class="text-sm">Sanpark.angkor@googlemail.com</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>📍</span>
                            <span>Siem Reap, Cambodia</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>🕒</span>
                            <span>Available 24/7</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-gray-700 mt-8 pt-8 text-center">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-gray-400 text-sm">
                        &copy; 2025 San Park - Personal Angkor Tour Guide. All rights reserved.
                    </p>
                    <div class="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                        <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                        <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Sitemap</a>
                    </div>
                </div>
                <div class="mt-4 text-gray-500 text-xs">
                    <p>Licensed Professional Tour Guide | Certified by Cambodia Ministry of Tourism</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
// Footer component with comprehensive contact information and links
</script>

<style scoped>
/* Footer styling */
footer {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

/* Link hover effects */
a {
    transition: all 0.3s ease;
}

a:hover {
    transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .md\\:col-span-2 {
        grid-column: span 1;
    }
}
</style>