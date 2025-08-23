# San Park - Personal Angkor Tour Guide

A modern, responsive personal website for San Park's professional Angkor Wat tour guide services built with Vue 3, TypeScript, and PrimeVue.

## 🌟 Features

### ✅ **Fully Debugged & Enhanced Pages**
- **Home Page**: Interactive hero carousel, featured tours, temple highlights, testimonials
- **Tours Page**: Complete tour listings with booking functionality and error handling
- **Contact Page**: Enhanced contact form with validation and multiple contact methods

### 🚀 **Performance Optimizations**
- Lazy image loading with intersection observer
- Resource hints (DNS prefetch, preconnect)
- Service worker ready for caching
- Performance monitoring and metrics
- Bundle size optimization
- Memory usage monitoring

### 🎨 **UI/UX Enhancements**
- Responsive design for all screen sizes
- Smooth animations and transitions
- Loading states and error handling
- Interactive hover effects
- Accessibility improvements (ARIA labels, keyboard navigation)
- Professional styling with Tailwind CSS

### 🔍 **SEO Optimizations**
- Dynamic meta tags for each page
- Open Graph and Twitter Card support
- Structured data for rich snippets
- Canonical URLs
- Optimized page titles and descriptions

### 🛡️ **Error Handling & Validation**
- Comprehensive form validation
- API error handling with user feedback
- Graceful fallbacks for missing data
- Input sanitization and validation
- Loading states for better UX

### ♿ **Accessibility Features**
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Semantic HTML structure

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with Composition API
- **UI Framework**: PrimeVue with Aura theme
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **HTTP Client**: Axios

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── Home.vue        # Enhanced homepage with carousel
│   ├── Tours.vue       # Tour listings with booking
│   ├── Contact.vue     # Contact form with validation
│   ├── Header.vue      # Navigation header
│   └── Footer.vue      # Site footer
├── stores/             # Pinia stores
│   └── tourStore.ts    # Tour data management
├── utils/              # Utility functions
│   ├── seo.ts         # SEO optimization utilities
│   ├── performance.ts  # Performance monitoring
│   ├── imageConfig.ts  # Image configuration
│   └── placeholderImages.ts # Placeholder images
├── data/              # Static data files
│   └── tours.json     # Tour information
└── assets/            # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sanpark-angkor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WHATSAPP_NUMBER=+85512788354
VITE_CONTACT_EMAIL=Sanpark.angkor@googlemail.com
```

### API Integration
The application expects a backend API with the following endpoints:
- `POST /api/book` - Tour booking
- `POST /api/contact` - Contact form submission

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with hover effects
- **Tablet**: Optimized layouts and touch-friendly interactions
- **Mobile**: Streamlined interface with mobile-first design

## 🎯 Key Improvements Made

### 1. **Bug Fixes**
- ✅ Fixed CSS class typo in TourGuide.vue (`md-grid-cols-2` → `md:grid-cols-2`)
- ✅ Added missing PrimeVue component imports
- ✅ Fixed hardcoded API URLs with environment-based configuration
- ✅ Improved error handling across all components

### 2. **Performance Enhancements**
- ✅ Implemented lazy loading for images
- ✅ Added resource hints for faster loading
- ✅ Performance monitoring and metrics
- ✅ Optimized bundle size and memory usage

### 3. **SEO Improvements**
- ✅ Dynamic meta tags for each page
- ✅ Structured data for better search visibility
- ✅ Open Graph and Twitter Card support
- ✅ Optimized page titles and descriptions

### 4. **Accessibility Enhancements**
- ✅ Added ARIA labels and descriptions
- ✅ Improved keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus indicators and semantic HTML

### 5. **User Experience**
- ✅ Loading states for all async operations
- ✅ Comprehensive error handling with user feedback
- ✅ Form validation with real-time feedback
- ✅ Smooth animations and transitions

## 🔍 Testing

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms validate properly
- [ ] Images load with fallbacks
- [ ] Responsive design works on all devices
- [ ] Accessibility features function correctly

### Performance Testing
- [ ] Page load times under 3 seconds
- [ ] Images lazy load properly
- [ ] No memory leaks detected
- [ ] Bundle size optimized

## 🚀 Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Configure API endpoints
- [ ] Set up error monitoring
- [ ] Enable service worker
- [ ] Configure CDN for static assets
- [ ] Set up analytics tracking

## 📞 Support

For technical support or questions about the tour guide service:
- **Email**: Sanpark.angkor@googlemail.com
- **Phone**: +855 12 788 354
- **WhatsApp**: +855 12 788 354

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for authentic Angkor experiences**
