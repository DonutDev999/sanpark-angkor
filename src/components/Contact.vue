<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import { updatePageSEO } from '../utils/seo';
import { contactActions } from '../config/contact';
import axios from 'axios';

const name = ref('');
const email = ref('');
const phone = ref('');
const tourType = ref('');
const groupSize = ref('');
const preferredDate = ref(null);
const message = ref('');
const submitting = ref(false);
const success = ref(false);
const error = ref('');

// Form validation
const nameError = ref('');
const emailError = ref('');
const phoneError = ref('');
const messageError = ref('');

// Tour options
const tourOptions = ref([
  { label: 'Angkor Wat Sunrise Tour', value: 'sunrise' },
  { label: 'Small Circuit Tour (Full Day)', value: 'small-circuit' },
  { label: 'Grand Circuit Tour (Full Day)', value: 'grand-circuit' },
  { label: 'Banteay Srei & Kbal Spean', value: 'banteay-srei' },
  { label: 'Multi-day Angkor Explorer', value: 'multi-day' },
  { label: 'Custom Tour (Tell me your preferences)', value: 'custom' }
]);

const groupSizeOptions = ref([
  { label: '1 person (Solo traveler)', value: '1' },
  { label: '2 people (Couple)', value: '2' },
  { label: '3-4 people (Small group)', value: '3-4' },
  { label: '5-8 people (Medium group)', value: '5-8' },
  { label: '9+ people (Large group)', value: '9+' }
]);

const isFormValid = computed(() => {
  return name.value.trim().length >= 2 && 
         email.value.includes('@') && 
         message.value.trim().length >= 10 &&
         (phone.value.trim().length === 0 || phoneError.value === '');
});

const validateName = () => {
  if (name.value.trim().length < 2) {
    nameError.value = 'Name must be at least 2 characters long';
    return false;
  }
  nameError.value = '';
  return true;
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address';
    return false;
  }
  emailError.value = '';
  return true;
};

const validatePhone = () => {
  if (phone.value.trim().length > 0) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone.value) || phone.value.length < 8) {
      phoneError.value = 'Please enter a valid phone number';
      return false;
    }
  }
  phoneError.value = '';
  return true;
};

const validateMessage = () => {
  if (message.value.trim().length < 10) {
    messageError.value = 'Message must be at least 10 characters long';
    return false;
  }
  messageError.value = '';
  return true;
};

onMounted(() => {
  // Update SEO for contact page
  updatePageSEO('contact');
});

const submitForm = async () => {
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
        return;
    }

    submitting.value = true;
    success.value = false;
    error.value = '';

    try {
        // In production, this should use environment variables
        const apiUrl = import.meta.env.PROD ? '/api/contact' : 'http://localhost:3000/contact';
        
        await axios.post(apiUrl, {
            name: name.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            tourType: tourType.value,
            groupSize: groupSize.value,
            preferredDate: preferredDate.value,
            message: message.value.trim(),
        });
        
        success.value = true;
        // Clear form
        name.value = '';
        email.value = '';
        phone.value = '';
        tourType.value = '';
        groupSize.value = '';
        preferredDate.value = null;
        message.value = '';
        // Clear errors
        nameError.value = '';
        emailError.value = '';
        phoneError.value = '';
        messageError.value = '';
    } catch (err) {
        console.error('Contact form error:', err);
        error.value = 'Failed to send message. Please try again or contact us directly via WhatsApp.';
    } finally {
        submitting.value = false;
    }
};
</script>

<template>
    <div class="container mx-auto p-4 py-12">
        <div class="max-w-4xl mx-auto">
            <!-- Header Section -->
            <section class="text-center mb-12">
                <h1 class="text-5xl font-bold text-gray-800 mb-6">Contact San Park</h1>
                <p class="text-lg text-gray-600 mb-4">
                    Ready to explore Angkor with a professional licensed guide? I'm here to help you plan your perfect temple adventure!
                </p>
                <div class="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-3 mb-8">
                    <span class="text-2xl">⚡</span>
                    <span class="text-green-700 font-semibold">Quick Response - Usually within 1 hour!</span>
                </div>
                
                <!-- Contact Info Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer text-center" @click="contactActions.makeCall()">
                        <div class="text-3xl mb-2">📞</div>
                        <h3 class="font-bold text-blue-800 mb-1 text-sm">Call Me</h3>
                        <p class="text-blue-600 font-semibold text-xs">+855 12 788 354</p>
                        <p class="text-xs text-blue-500 mt-1">Available 24/7</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer text-center" @click="contactActions.openWhatsApp()">
                        <div class="text-3xl mb-2">💬</div>
                        <h3 class="font-bold text-green-800 mb-1 text-sm">WhatsApp</h3>
                        <p class="text-green-600 font-semibold text-xs">+855 12 788 354</p>
                        <p class="text-xs text-green-500 mt-1">Instant messaging</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer text-center" @click="contactActions.openEmail()">
                        <div class="text-3xl mb-2">📧</div>
                        <h3 class="font-bold text-purple-800 mb-1 text-sm">Email</h3>
                        <p class="text-purple-600 font-semibold text-xs">Sanpark.angkor@googlemail.com</p>
                        <p class="text-xs text-purple-500 mt-1">Detailed inquiries</p>
                    </div>
                    <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 text-center">
                        <div class="text-3xl mb-2">📍</div>
                        <h3 class="font-bold text-orange-800 mb-1 text-sm">Location</h3>
                        <p class="text-orange-600 font-semibold text-xs">Siem Reap</p>
                        <p class="text-xs text-orange-500 mt-1">Cambodia</p>
                    </div>
                </div>
            </section>

            <!-- Feedback Messages -->
            <div v-if="success" class="mb-6">
                <Message severity="success" :closable="true" @close="success = false">
                    <div class="flex items-center">
                        <span class="text-2xl mr-3">✅</span>
                        <div>
                            <strong>Message sent successfully!</strong>
                            <p class="text-sm mt-1">I'll get back to you within 1 hour during daytime.</p>
                        </div>
                    </div>
                </Message>
            </div>
            
            <div v-if="error" class="mb-6">
                <Message severity="error" :closable="true" @close="error = ''">
                    {{ error }}
                </Message>
            </div>

            <!-- Contact Form -->
            <form @submit.prevent="submitForm" class="bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-16">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">📝 Book Your Tour or Send a Message</h2>
                
                <div class="space-y-6">
                    <!-- Personal Information Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Name Field -->
                        <div>
                            <label for="name" class="block text-gray-700 font-semibold mb-2">
                                Full Name <span class="text-red-500">*</span>
                            </label>
                            <InputText 
                                id="name" 
                                v-model="name" 
                                :class="{ 'p-invalid': nameError }"
                                @blur="validateName"
                                placeholder="Enter your full name"
                                aria-describedby="name-error"
                                required 
                            />
                            <small v-if="nameError" id="name-error" class="text-red-500 mt-1 block">
                                {{ nameError }}
                            </small>
                        </div>

                        <!-- Email Field -->
                        <div>
                            <label for="email" class="block text-gray-700 font-semibold mb-2">
                                Email Address <span class="text-red-500">*</span>
                            </label>
                            <InputText 
                                id="email" 
                                type="email" 
                                v-model="email" 
                                :class="{ 'p-invalid': emailError }"
                                @blur="validateEmail"
                                placeholder="your.email@example.com"
                                aria-describedby="email-error"
                                required 
                            />
                            <small v-if="emailError" id="email-error" class="text-red-500 mt-1 block">
                                {{ emailError }}
                            </small>
                        </div>
                    </div>

                    <!-- Contact & Tour Info Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Phone Field -->
                        <div>
                            <label for="phone" class="block text-gray-700 font-semibold mb-2">
                                Phone Number <span class="text-gray-400">(Optional)</span>
                            </label>
                            <InputText 
                                id="phone" 
                                v-model="phone" 
                                :class="{ 'p-invalid': phoneError }"
                                @blur="validatePhone"
                                placeholder="+855 12 345 678"
                                aria-describedby="phone-error"
                            />
                            <small v-if="phoneError" id="phone-error" class="text-red-500 mt-1 block">
                                {{ phoneError }}
                            </small>
                            <small class="text-gray-500 mt-1 block">
                                For WhatsApp contact (recommended)
                            </small>
                        </div>

                        <!-- Tour Type -->
                        <div>
                            <label for="tourType" class="block text-gray-700 font-semibold mb-2">
                                Interested Tour <span class="text-gray-400">(Optional)</span>
                            </label>
                            <Dropdown 
                                id="tourType"
                                v-model="tourType" 
                                :options="tourOptions" 
                                optionLabel="label" 
                                optionValue="value"
                                placeholder="Select a tour type"
                                class="w-full"
                            />
                            <small class="text-gray-500 mt-1 block">
                                Help me prepare the best information for you
                            </small>
                        </div>
                    </div>

                    <!-- Tour Details Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Group Size -->
                        <div>
                            <label for="groupSize" class="block text-gray-700 font-semibold mb-2">
                                Group Size <span class="text-gray-400">(Optional)</span>
                            </label>
                            <Dropdown 
                                id="groupSize"
                                v-model="groupSize" 
                                :options="groupSizeOptions" 
                                optionLabel="label" 
                                optionValue="value"
                                placeholder="How many people?"
                                class="w-full"
                            />
                        </div>

                        <!-- Preferred Date -->
                        <div>
                            <label for="preferredDate" class="block text-gray-700 font-semibold mb-2">
                                Preferred Date <span class="text-gray-400">(Optional)</span>
                            </label>
                            <Calendar 
                                id="preferredDate"
                                v-model="preferredDate" 
                                placeholder="Select your preferred date"
                                :minDate="new Date()"
                                dateFormat="dd/mm/yy"
                                class="w-full"
                            />
                            <small class="text-gray-500 mt-1 block">
                                When would you like to visit?
                            </small>
                        </div>
                    </div>

                    <!-- Message Field -->
                    <div>
                        <label for="message" class="block text-gray-700 font-semibold mb-2">
                            Your Message <span class="text-red-500">*</span>
                        </label>
                        <Textarea 
                            id="message" 
                            v-model="message" 
                            :class="{ 'p-invalid': messageError }"
                            @blur="validateMessage"
                            rows="6" 
                            placeholder="Tell me about your interests, special requests, accessibility needs, or any questions you have about the tours..."
                            aria-describedby="message-error"
                            required 
                        />
                        <small v-if="messageError" id="message-error" class="text-red-500 mt-1 block">
                            {{ messageError }}
                        </small>
                        <small class="text-gray-500 mt-1 block">
                            {{ message.length }}/1000 characters (minimum 10 required)
                        </small>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="text-center mt-8">
                    <Button 
                        type="submit" 
                        :label="submitting ? 'Sending...' : 'Send Message'" 
                        :loading="submitting"
                        :disabled="submitting || !isFormValid"
                        class="px-8 py-3 bg-amber-500 hover:bg-amber-600 border-none font-semibold text-lg"
                        :aria-label="submitting ? 'Sending message, please wait' : 'Send your message'"
                    />
                </div>

                <!-- Form Help Text -->
                <div class="mt-6 text-center text-sm text-gray-500">
                    <p>I typically respond within 1 hour during daytime. For urgent inquiries, please call or WhatsApp me directly.</p>
                </div>
            </form>


            <!-- FAQ Section -->
            <div class="bg-gray-50 rounded-xl p-8 mb-12">
                <h3 class="text-2xl font-bold text-gray-800 mb-8 text-center">❓ Frequently Asked Questions</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <span class="text-xl mr-2">🕐</span>
                            How quickly do you respond?
                        </h4>
                        <p class="text-gray-600">I usually respond within 1 hour during daytime (8 AM - 8 PM Cambodia time). For urgent bookings, WhatsApp or call me directly!</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <span class="text-xl mr-2">💰</span>
                            What are your tour prices?
                        </h4>
                        <p class="text-gray-600">Prices vary by tour type and group size. I offer competitive rates with no hidden fees. Contact me for a personalized quote!</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <span class="text-xl mr-2">🗣️</span>
                            What languages do you speak?
                        </h4>
                        <p class="text-gray-600">I'm fluent in English and Khmer (Cambodian). I can provide clear explanations of temple history and Cambodian culture.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <span class="text-xl mr-2">📅</span>
                            How far in advance should I book?
                        </h4>
                        <p class="text-gray-600">I recommend booking at least 1-2 days in advance, especially during peak season. However, I can often accommodate same-day requests!</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <span class="text-xl mr-2">🚗</span>
                            Do you provide transportation?
                        </h4>
                        <p class="text-gray-600">Yes! I can arrange comfortable, air-conditioned transportation for your tours. This is included in most tour packages.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <span class="text-xl mr-2">🎫</span>
                            What about temple tickets?
                        </h4>
                        <p class="text-gray-600">Temple entrance tickets are separate from guide fees. I'll help you purchase the right pass and explain all the options available.</p>
                    </div>
                </div>
            </div>

            <!-- Trust Indicators -->
            <div class="text-center">
                <h3 class="text-xl font-bold text-gray-800 mb-8">🏆 Why Choose San Park?</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-3xl mb-2">🏆</div>
                        <h4 class="font-bold text-gray-800 mb-2 text-sm">Licensed Professional</h4>
                        <p class="text-gray-600 text-xs text-center">Certified by Cambodia Ministry of Tourism</p>
                    </div>
                    <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-3xl mb-2">⭐</div>
                        <h4 class="font-bold text-gray-800 mb-2 text-sm">5-Star Reviews</h4>
                        <p class="text-gray-600 text-xs text-center">Consistently rated excellent by travelers</p>
                    </div>
                    <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-3xl mb-2">🛡️</div>
                        <h4 class="font-bold text-gray-800 mb-2 text-sm">Safe & Reliable</h4>
                        <p class="text-gray-600 text-xs text-center">Your safety and satisfaction are my priorities</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Form styling */
.p-inputtext,
.p-textarea {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.p-inputtext:focus,
.p-textarea:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.p-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}

/* Contact info cards */
.bg-gray-50:hover {
  background-color: #f9fafb;
  transform: translateY(-2px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Button enhancements */
.p-button {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.p-button:hover {
  transform: translateY(-2px);
}

.p-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form container */
form {
  transition: all 0.3s ease;
}

form:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Message styling */
.p-message {
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  h1 {
    font-size: 2.5rem !important;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
  
  form {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem !important;
  }
  
  h2 {
    font-size: 1.5rem !important;
  }
  
  .flex-col {
    flex-direction: column;
  }
}

/* Accessibility improvements */
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

/* Focus indicators */
button:focus,
input:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Animation for success/error messages */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.p-message {
  animation: slideIn 0.3s ease-out;
}
</style>
