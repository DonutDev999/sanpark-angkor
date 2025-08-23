# 🚀 Quick Vercel Deployment

## Ready to Deploy! ✅

Your Sanpark Angkor app is configured for Vercel deployment. I've set up:

### ✅ What's Ready:
- **Frontend**: Vue.js app with Vite build system
- **Backend**: Serverless API functions for tours, booking, and contact
- **Configuration**: `vercel.json` with proper routing
- **Dependencies**: All required packages added
- **Build**: Optimized for production

### 🚀 Deploy Now (2 minutes):

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project" 
   - Import your repository
   - Click "Deploy" (auto-detects Vite)

3. **Add Environment Variables** in Vercel dashboard:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-gmail-app-password
   BUSINESS_EMAIL=bookings@yourdomain.com
   BUSINESS_NAME=Sanpark Angkor Tours
   WHATSAPP_PHONE=+855123456789
   ```

### 📧 Gmail Setup:
1. Enable 2FA on Google account
2. Go to Security → App passwords
3. Generate password for "Mail"
4. Use as `GMAIL_APP_PASSWORD`

### 🎯 Your App Features:
- **Homepage**: Hero section with temple tours
- **Tours**: Interactive tour booking system
- **Contact**: Email contact form
- **Mobile**: Fully responsive design
- **API**: `/api/tours`, `/api/booking`, `/api/contact`

### ⚡ Performance Optimized:
- Code splitting for faster loading
- Image optimization
- Serverless functions
- CDN delivery

---

**That's it! Your temple tour booking app will be live in minutes! 🏛️**

Need help? Check `DEPLOYMENT_GUIDE.md` for detailed instructions.