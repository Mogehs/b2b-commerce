# Pre-Deployment Checklist

## ✅ Code Preparation

- [ ] All changes committed and pushed to GitHub
- [ ] No sensitive data in code (check for hardcoded secrets)
- [ ] `.env.local` is in `.gitignore`
- [ ] Build runs successfully locally (`npm run build`)

## ✅ Environment Variables

- [ ] MONGODB_URI (MongoDB Atlas connection string)
- [ ] AUTH_SECRET (random string for JWT signing)
- [ ] NEXTAUTH_URL (will be your Vercel app URL)
- [ ] GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
- [ ] FACEBOOK_CLIENT_ID & FACEBOOK_CLIENT_SECRET
- [ ] Email configuration (Gmail app password setup)
- [ ] Cloudinary credentials
- [ ] NEXT_PUBLIC_MAPBOX_TOKEN

## ✅ OAuth Configuration

- [ ] Google Console: Add Vercel domain to authorized origins
- [ ] Google Console: Add callback URL: `https://your-app.vercel.app/api/auth/callback/google`
- [ ] Facebook Developer: Add callback URL: `https://your-app.vercel.app/api/auth/callback/facebook`

## ✅ Database Setup

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0 for Vercel)
- [ ] Connection string tested

## ✅ External Services

- [ ] Gmail app password generated for email sending
- [ ] Cloudinary account setup with upload presets
- [ ] Mapbox account with token generated

## ✅ Vercel Setup

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Environment variables added in Vercel dashboard
- [ ] Domain configured (if using custom domain)

## ✅ Post-Deployment

- [ ] Test authentication (Google, Facebook, credentials)
- [ ] Test image uploads
- [ ] Test email sending
- [ ] Test database operations
- [ ] Test map functionality
- [ ] Monitor function logs for errors

## 🚨 Known Limitations on Vercel Free Tier

- WebSocket connections (Socket.io) have limitations
- 10-second function timeout
- Cold start delays
- Limited concurrent function executions

## 📝 Quick Commands

### Test build locally:

```bash
npm run build
npm start
```

### Check environment variables:

```bash
cat .env.local
```

### Verify dependencies:

```bash
npm audit
npm outdated
```
