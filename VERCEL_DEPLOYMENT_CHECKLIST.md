# ✅ Vercel Deployment Checklist

## Files Created for Deployment
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/tours.js` - Tours API endpoint
- ✅ `api/booking.js` - Booking API endpoint  
- ✅ `api/contact.js` - Contact form API endpoint
- ✅ `.vercelignore` - Files to ignore during deployment
- ✅ `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- ✅ Updated `vite.config.ts` with build optimizations
- ✅ Updated `package.json` with nodemailer dependency

## Pre-Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Environment Variables to Set in Vercel
**Required:**
- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Gmail app password (not regular password!)
- `BUSINESS_EMAIL` - Where to receive bookings
- `BUSINESS_NAME` - Your business name

**Optional:**
- `WHATSAPP_PHONE` - Your WhatsApp number
- `VITE_GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID

### 3. Gmail App Password Setup
1. Enable 2FA on your Google account
2. Go to Google Account → Security → App passwords
3. Generate password for "Mail"
4. Use this as `GMAIL_APP_PASSWORD`

## Deployment Process

### Quick Deploy (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Click "Deploy" (Vercel auto-detects Vite)
6. Add environment variables in Settings
7. Redeploy if needed

### CLI Deploy
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Post-Deployment Testing

### Test These Features:
- [ ] Homepage loads correctly
- [ ] Tours page displays tour data
- [ ] Contact form sends emails
- [ ] Booking form works and sends confirmation emails
- [ ] WhatsApp links work
- [ ] Mobile responsiveness

### API Endpoints to Test:
- `GET /api/tours` - Should return tour data
- `POST /api/contact` - Should send contact email
- `POST /api/booking` - Should send booking confirmation

## Expected URLs After Deployment
- **Frontend:** `https://your-app-name.vercel.app`
- **API:** `https://your-app-name.vercel.app/api/tours`

## Troubleshooting

### Build Issues
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Test build locally: `npm run build`

### Email Issues
- Verify Gmail app password (not regular password)
- Check environment variables are set correctly
- Look at function logs in Vercel dashboard

### API Issues
- Check function logs in Vercel dashboard
- Test API endpoints directly in browser
- Verify CORS headers

## Performance Features Included
- ✅ Code splitting for faster loading
- ✅ Asset optimization
- ✅ Serverless functions for backend
- ✅ CDN delivery via Vercel Edge Network
- ✅ Automatic HTTPS

## Next Steps After Deployment
1. Test all functionality
2. Set up custom domain (optional)
3. Configure Google Analytics
4. Monitor performance in Vercel dashboard
5. Set up monitoring/alerts

---

**Your Sanpark Angkor tour booking app is ready for Vercel! 🚀**

Need help? Check the detailed `DEPLOYMENT_GUIDE.md` or Vercel's documentation.