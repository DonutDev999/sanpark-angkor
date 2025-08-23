# 🏛️ Siem Reap Temple Website - Image Hosting Implementation Guide

## 📁 **Current Setup**

Your website now uses a professional image management system with:
- ✅ Organized folder structure
- ✅ Placeholder system for development
- ✅ Fallback mechanisms for broken images
- ✅ Optimized image component
- ✅ Ready for production deployment

## 🗂️ **Image Directory Structure**

```
public/images/
├── hero/                    # Hero carousel images (1920x1080)
│   ├── angkor-wat-sunrise-1920.webp
│   ├── bayon-temple-1920.webp
│   ├── ta-prohm-1920.webp
│   ├── angkor-reflection-1920.webp
│   └── banteay-srei-1920.webp
├── tours/                   # Tour card images (800x600)
│   ├── angkor-wat-sunrise-800.webp
│   ├── bayon-temple-800.webp
│   ├── ta-prohm-800.webp
│   ├── banteay-srei-800.webp
│   ├── angkor-reflection-800.webp
│   └── jungle-temple-800.webp
├── temples/                 # Temple detail images (800x600)
│   ├── angkor-wat-detail-800.webp
│   ├── bayon-faces-800.webp
│   └── ta-prohm-roots-800.webp
└── thumbnails/              # Small preview images (400x300)
    ├── angkor-wat-thumb-400.webp
    └── bayon-thumb-400.webp
```

## 🚀 **Deployment Options**

### **Option 1: Vercel/Netlify (Recommended - FREE)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add optimized image system"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repo to Vercel
   - Auto-deploys on every push
   - Global CDN included
   - **Cost: FREE**

3. **Add Real Images:**
   - Replace placeholder images in `public/images/` folders
   - Commit and push - auto-deploys

### **Option 2: Cloudinary (Advanced)**

1. **Setup Cloudinary Account:**
   ```javascript
   // Add to .env
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```

2. **Update Image Config:**
   ```typescript
   // src/utils/imageConfig.ts
   export const getCloudinaryUrl = (imageName: string, width: number, height: number) => {
     return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/temples/${imageName}`;
   };
   ```

## 📸 **Adding Real Temple Images**

### **Step 1: Collect Images**
- **Sources:** Unsplash, Pexels, your own photos
- **Formats:** JPEG → convert to WebP
- **Sizes needed:**
  - Hero: 1920x1080px
  - Tours: 800x600px  
  - Temples: 800x600px
  - Thumbnails: 400x300px

### **Step 2: Optimize Images**
```bash
# Install image optimization tool
npm install -g @squoosh/cli

# Convert and optimize
squoosh-cli --webp '{"quality":80}' --resize '{"width":1920,"height":1080}' your-image.jpg
```

### **Step 3: Replace Placeholders**
1. Add optimized images to correct folders
2. Keep the same filenames as defined in the system
3. Test locally: `npm run dev`
4. Deploy: `git push`

## 🔧 **Current Implementation Features**

### **Smart Image Loading:**
- ✅ Automatic fallback to placeholders in development
- ✅ Error handling for broken images
- ✅ Lazy loading for performance
- ✅ Smooth transitions

### **SEO Optimized:**
- ✅ Proper alt tags
- ✅ WebP format support
- ✅ Responsive images
- ✅ Fast loading times

### **Developer Friendly:**
- ✅ Easy to add new images
- ✅ Consistent naming convention
- ✅ TypeScript support
- ✅ Organized structure

## 🎯 **Next Steps**

1. **Collect authentic Siem Reap temple photos**
2. **Optimize images using the guide above**
3. **Replace placeholder images**
4. **Deploy to Vercel/Netlify**
5. **Test on live site**

## 📱 **Performance Benefits**

- **WebP Format:** 25-35% smaller than JPEG
- **Lazy Loading:** Faster initial page load
- **CDN Delivery:** Global fast access
- **Fallback System:** No broken images
- **Optimized Sizes:** Right size for each use case

## 🆘 **Support**

If you need help:
1. Check browser console for image loading errors
2. Verify image paths match the structure
3. Ensure images are in WebP format
4. Test locally before deploying

Your website is now ready for professional image hosting! 🚀