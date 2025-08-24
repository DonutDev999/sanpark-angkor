# 🚀 Vercel Deployment - Step by Step Guide

## ✅ Pre-Deployment Checklist

Your Sanpark Angkor Tours app is **ready for deployment**! Here's what's already configured:

### ✅ What's Ready:
- **Frontend**: Vue.js app with Vite build system
- **Backend**: Serverless API functions (`/api/tours`, `/api/booking`, `/api/contact`)
- **Configuration**: `vercel.json` with proper routing and build settings
- **Dependencies**: All required packages including `nodemailer`
- **Build Optimization**: Code splitting and asset optimization
- **CORS**: Properly configured for cross-origin requests

## 🚀 Deploy Now (5 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your repository
5. Vercel will auto-detect Vite configuration
6. Click **"Deploy"**

### Step 3: Configure Environment Variables
In your Vercel dashboard, go to **Settings > Environment Variables** and add:

#### Required (for email functionality):
```
GMAIL_USER = your-email@gmail.com
GMAIL_APP_PASSWORD = your-gmail-app-password
BUSINESS_EMAIL = bookings@yourdomain.com
BUSINESS_NAME = Sanpark Angkor Tours
```

#### Optional:
```
WHATSAPP_PHONE = +855123456789
VITE_GOOGLE_ANALYTICS_ID = G-XXXXXXXXXX
```

### Step 4: Gmail App Password Setup
1. Enable 2FA on your Google account
2. Go to **Google Account → Security → App passwords**
3. Generate password for "Mail"
4. Use this as `GMAIL_APP_PASSWORD` (not your regular password!)

## 🎯 Your App Features After Deployment

### Frontend Features:
- **Homepage**: Hero section with Angkor temple tours
- **Tours Page**: Interactive tour listings with booking
- **Contact Form**: Direct email contact system
- **Mobile Responsive**: Works perfectly on all devices
- **Fast Loading**: Optimized with code splitting

### API Endpoints:
- `GET /api/tours` - Returns tour data from JSON
- `POST /api/contact` - Sends contact form emails
- `POST /api/booking` - Processes tour bookings with email confirmations

### Performance Features:
- ⚡ Code splitting for faster loading
- 🖼️ Optimized image handling
- 🌐 CDN delivery via Vercel Edge Network
- 🔒 Automatic HTTPS
- 📱 Mobile-first responsive design

## 🧪 Testing After Deployment

### Test These URLs:
- `https://your-app.vercel.app` - Homepage
- `https://your-app.vercel.app/tours` - Tours page
- `https://your-app.vercel.app/api/tours` - API endpoint

### Test These Features:
- [ ] Homepage loads with hero section
- [ ] Tours page displays tour listings
- [ ] Contact form sends emails
- [ ] Booking form works and sends confirmations
- [ ] WhatsApp links work
- [ ] Mobile responsiveness
- [ ] All images load properly

## 🔧 Troubleshooting

### Build Issues:
- Check Vercel build logs in dashboard
- Ensure all dependencies are in `package.json`
- Test locally: `npm run build`

### Email Issues:
- Verify Gmail app password (not regular password)
- Check environment variables are set correctly
- Look at function logs in Vercel dashboard

### API Issues:
- Check function logs in Vercel dashboard
- Test API endpoints directly in browser
- Verify CORS headers in network tab

## 🎉 Next Steps After Deployment

1. **Test Everything**: Go through all features
2. **Custom Domain**: Add your own domain (optional)
3. **Analytics**: Set up Google Analytics
4. **Monitoring**: Check Vercel dashboard regularly
5. **SEO**: Submit to Google Search Console

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vue.js Docs**: https://vuejs.org/guide/
- **Vite Docs**: https://vitejs.dev/guide/

---

**🏛️ Your Sanpark Angkor temple tour booking app will be live in minutes!**

Need help? Check the detailed `DEPLOYMENT_GUIDE.md` or run `node deploy-to-vercel.js` for automated checks.