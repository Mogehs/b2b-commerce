# Render Deployment Guide

This guide will help you deploy your Next.js e-commerce application to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Environment variables ready (see `.env.example`)

## Deployment Steps

### 1. Database Setup

First, set up a MongoDB database. You can use:

- MongoDB Atlas (recommended for production)
- Render's own PostgreSQL if you want to migrate from MongoDB

### 2. Environment Variables

In your Render dashboard, add these environment variables:

**Required:**

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: A secure random string for NextAuth
- `NEXTAUTH_URL`: Your Render app URL (https://your-app-name.onrender.com)
- `NODE_ENV`: Set to `production`

**Optional (depending on features used):**

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth
- `FACEBOOK_CLIENT_ID` & `FACEBOOK_CLIENT_SECRET`: For Facebook OAuth
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: For image uploads
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: For email functionality
- `NEXT_PUBLIC_MAPBOX_TOKEN`: For maps functionality
- `NEXT_PUBLIC_SITE_URL`: Your production URL

### 3. Deploy to Render

#### Option 1: Using the Render Dashboard

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: Choose a name for your app
   - **Environment**: Node
   - **Build Command**: `chmod +x render-build.sh && ./render-build.sh`
   - **Start Command**: `npm start`
   - **Instance Type**: Choose based on your needs (Free tier available)

#### Option 2: Using render.yaml (Infrastructure as Code)

1. The `render.yaml` file is already configured in your project
2. Simply connect your repository and Render will use this configuration
3. Update the environment variables in the file or through the dashboard

### 4. Post-Deployment Setup

1. Update your OAuth redirect URIs in Google/Facebook developer consoles
2. Update `NEXT_PUBLIC_SOCKET_URL` to your Render app URL
3. Test all functionality, especially real-time features

## Important Notes

### Socket.io Configuration

Your app uses a custom server with Socket.io for real-time features. The configuration has been optimized for Render:

- Server listens on `0.0.0.0` (required for Render)
- CORS is configured for production URLs
- WebSocket transports are enabled

### Environment-Specific Settings

- Development: Uses `localhost:3000`
- Production: Uses your Render app URL
- Make sure to update `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` after deployment

### Performance Optimization

- The app is configured with `serverExternalPackages: ["mongoose"]` for better performance
- Webpack externals are configured for Socket.io dependencies

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Socket.io Connection Issues**: Verify CORS settings and URL configurations
3. **Database Connection**: Ensure MongoDB URI is correct and database is accessible
4. **Authentication Issues**: Verify all auth environment variables are set correctly

### Logs and Debugging

- Use Render's log viewer to debug issues
- Check both build logs and runtime logs
- Enable detailed logging in your app if needed

## Monitoring

- Set up Render's health checks
- Monitor your MongoDB usage and performance
- Consider setting up alerts for your application

## Scaling

- Render offers various instance types for scaling
- Consider implementing caching strategies for better performance
- Monitor your Socket.io connections as they can impact memory usage
