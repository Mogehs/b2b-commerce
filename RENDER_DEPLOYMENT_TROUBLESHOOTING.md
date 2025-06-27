# 🚀 Render Deployment Checklist for Cloudinary

## ❗ CRITICAL: Why Image Uploads Fail on Render

### 1. **Environment Variables Missing**

- ✅ Set all Cloudinary variables in Render Dashboard
- ✅ Verify no extra spaces in environment values
- ✅ Test with `/api/debug/env` endpoint

### 2. **Required Render Environment Variables**

In your Render service dashboard, add these **exact** environment variables:

```
CLOUDINARY_CLOUD_NAME=dhqioo6t0
CLOUDINARY_API_KEY=332416721362342
CLOUDINARY_API_SECRET=kFXXUfXxqv14RcJMxlv3My98670

MONGODB_URI=mongodb+srv://mugheesurrehman06:gjRagzY5zTyRpCQs@mughees1.qnk6m.mongodb.net/b2b-commerece?retryWrites=true&w=majority&appName=Mughees1

AUTH_SECRET=LzIWCFc1K2sUv2tns3UFqy+6/I1fcdu829l4yX2SobU
NEXTAUTH_SECRET=LzIWCFc1K2sUv2tns3UFqy+6/I1fcdu829l4yX2SobU
NEXTAUTH_URL=https://your-app-name.onrender.com

GOOGLE_CLIENT_ID=316331234217-8p5t2clj9fbb15nu5u9sdobc7cuoo9sb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
FACEBOOK_CLIENT_ID=695721279737376
FACEBOOK_CLIENT_SECRET=9236210edf8121930d20b9e18bc617a4

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=mugheesurrehman06@gmail.com
EMAIL_PASS=rqqabmoinhiohbjv
EMAIL_FROM=mugheesurrehman06@gmail.com
EMAIL_FROM_NAME=b2b-commerce

NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibW9nZWhzIiwiYSI6ImNtYnFkYXV2MzAyZGoyanF6cXM4YzRqYW4ifQ.zhYRyPz0tT2e8E2AR_-UXA

NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-app-name.onrender.com
```

### 3. **Deployment Steps**

1. **Push Code to Git**

   ```bash
   git add .
   git commit -m "Fix Cloudinary for Render deployment"
   git push origin main
   ```

2. **In Render Dashboard:**

   - Go to your service settings
   - Add ALL environment variables above
   - **Replace `your-app-name` with your actual Render app name**
   - Deploy the service

3. **Test After Deployment:**
   - Visit: `https://your-app-name.onrender.com/api/debug/env`
   - Check that all variables are set
   - Visit: `https://your-app-name.onrender.com/api/test/cloudinary`
   - Should return success

### 4. **Common Issues & Solutions**

| Issue                           | Solution                                   |
| ------------------------------- | ------------------------------------------ |
| "Environment variables missing" | Set ALL variables in Render dashboard      |
| "Invalid credentials"           | Copy-paste credentials exactly (no spaces) |
| "500 server error"              | Check Cloudinary account is active         |
| "Timeout errors"                | Increase timeout in production             |

### 5. **Debug Commands After Deployment**

```bash
# Check environment variables
curl https://your-app-name.onrender.com/api/debug/env

# Test Cloudinary connection
curl https://your-app-name.onrender.com/api/test/cloudinary

# Test image upload
# Use the debug page at: https://your-app-name.onrender.com/debug
```

### 6. **OAuth Redirect URIs**

After deployment, update these in your OAuth providers:

**Google Console:**

- Add: `https://your-app-name.onrender.com/api/auth/callback/google`

**Facebook Developer:**

- Add: `https://your-app-name.onrender.com/api/auth/callback/facebook`

---

## 🎯 **Your Issue is 99% Environment Variables!**

The most common reason image uploads work locally but fail on Render is missing environment variables. Follow this checklist step by step!
