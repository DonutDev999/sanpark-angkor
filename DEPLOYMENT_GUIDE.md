# 🚀 Vercel Deployment Guide for Sanpark Angkor

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Gmail account for email functionality

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `sanpark-angkor` repository
4. Vercel will auto-detect the framework (Vite)
5. Click "Deploy"

### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Step 3: Configure Environment Variables

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

### Required for Email Functionality:
- `GMAIL_USER`: Your Gmail address (e.g., `your-email@gmail.com`)
- `GMAIL_APP_PASSWORD`: Gmail App Password (see setup below)
- `BUSINESS_EMAIL`: Email where bookings will be sent
- `BUSINESS_NAME`: Your business name

### Optional:
- `WHATSAPP_PHONE`: Your WhatsApp number (e.g., `+855123456789`)
- `VITE_GOOGLE_ANALYTICS_ID`: Google Analytics ID

## Step 4: Set Up Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to **Security > App passwords**
4. Generate an app password for "Mail"
5. Use this password as `GMAIL_APP_PASSWORD`

## Step 5: Update Your Domain

After deployment, update the `VITE_API_BASE_URL` in your environment variables to your Vercel domain:
```
VITE_API_BASE_URL=https://your-app-name.vercel.app
```

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Test the contact form
3. Test tour booking functionality
4. Check that emails are being sent

## API Endpoints Available

Your deployed app will have these API endpoints:
- `GET /api/tours` - Get tour data
- `POST /api/booking` - Submit booking
- `POST /api/contact` - Send contact message

## Automatic Deployments

Vercel will automatically redeploy your app when you push to your main branch.

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

## Troubleshooting

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

### Email Not Working
- Verify Gmail App Password is correct
- Check environment variables are set
- Look at function logs in Vercel dashboard

### API Errors
- Check function logs in Vercel dashboard
- Verify CORS settings
- Test API endpoints directly

## Performance Optimization

Your app is already optimized with:
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Serverless functions
- ✅ CDN delivery via Vercel

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review environment variables
3. Test locally with `npm run build && npm run preview`

---

**Your Sanpark Angkor app is now ready for production! 🎉**