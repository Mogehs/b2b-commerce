# Deployment Guide for Vercel

## Prerequisites

1. GitHub repository with your code
2. Vercel account (free tier)
3. MongoDB Atlas account (free tier)

## Steps to Deploy

### 1. Prepare your repository

1. Commit and push all changes to your GitHub repository
2. Make sure your `.env.local` file is not committed (it should be in `.gitignore`)

### 2. Create Vercel Account and Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your repository
4. Select "Next.js" as framework preset

### 3. Configure Environment Variables in Vercel

Go to your project settings in Vercel and add these environment variables:

**Database:**

- `MONGODB_URI`: Your MongoDB Atlas connection string

**Authentication:**

- `AUTH_SECRET`: Your authentication secret
- `NEXTAUTH_URL`: Your Vercel app URL (e.g., https://your-app.vercel.app)

**Google OAuth:**

- `GOOGLE_CLIENT_ID`: Your Google client ID
- `GOOGLE_CLIENT_SECRET`: Your Google client secret

**Facebook OAuth:**

- `FACEBOOK_CLIENT_ID`: Your Facebook client ID
- `FACEBOOK_CLIENT_SECRET`: Your Facebook client secret

**Email:**

- `EMAIL_HOST`: smtp.gmail.com
- `EMAIL_PORT`: 587
- `EMAIL_SECURE`: false
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password
- `EMAIL_FROM`: Your Gmail address
- `EMAIL_FROM_NAME`: Your app name

**Cloudinary:**

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

**Mapbox:**

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox token

**Socket.io (Note: Limited on Vercel free tier):**

- `NEXT_PUBLIC_SOCKET_URL`: Your Vercel app URL

### 4. Update OAuth Settings

**Google Console:**

1. Go to Google Cloud Console
2. Update authorized origins to include your Vercel URL
3. Update redirect URIs to include: `https://your-app.vercel.app/api/auth/callback/google`

**Facebook Developer:**

1. Go to Facebook Developers
2. Update Valid OAuth Redirect URIs to include: `https://your-app.vercel.app/api/auth/callback/facebook`

### 5. Deploy

1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Test your application

## Important Notes for Vercel Free Tier

### Socket.io Limitations

- Vercel free tier doesn't support WebSockets in serverless functions
- Real-time chat functionality may be limited
- Consider using polling or external services like Pusher/Ably for real-time features

### Function Timeout

- Serverless functions timeout at 10 seconds on free tier
- Heavy operations should be optimized

### Cold Starts

- First request after inactivity may be slower due to cold starts

## Alternative Socket.io Solutions for Production

### Option 1: Use Railway/Render for Socket Server

Deploy a separate Node.js server for Socket.io on Railway or Render

### Option 2: Use External Services

- **Pusher**: Real-time messaging service
- **Ably**: Real-time data delivery platform
- **Firebase**: Real-time database with WebSocket support

### Option 3: Polling Fallback

Implement polling-based updates for chat functionality

## Troubleshooting

### Build Errors

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Runtime Errors

- Check function logs in Vercel dashboard
- Verify database connection
- Check API routes are working

### OAuth Issues

- Verify redirect URIs are correctly configured
- Check environment variables are set
- Ensure NEXTAUTH_URL matches your domain

## Performance Optimization

1. **Image Optimization**: Already configured in `next.config.mjs`
2. **Static Generation**: Use ISR where possible
3. **API Optimization**: Optimize database queries
4. **Bundle Size**: Analyze and reduce bundle size if needed

## Monitoring

1. Use Vercel Analytics (free tier included)
2. Monitor function executions and errors
3. Set up Vercel's built-in monitoring

## Scaling Considerations

When ready to upgrade from free tier:

- **Pro Plan**: Longer function timeouts, more executions
- **Team Plan**: Collaboration features
- **Enterprise**: Custom solutions for real-time features
