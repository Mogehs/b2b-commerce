// Environment validation utility for production
export const validateEnvironment = () => {
  const requiredEnvVars = {
    // Database
    MONGODB_URI: process.env.MONGODB_URI,
    
    // Authentication
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    
    // Cloudinary (Critical for image uploads)
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  };

  const missing = [];
  const empty = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    } else if (typeof value === 'string' && value.trim().length === 0) {
      empty.push(key);
    }
  });

  if (missing.length > 0 || empty.length > 0) {
    console.error('❌ Environment Variables Validation Failed:');
    
    if (missing.length > 0) {
      console.error('Missing variables:', missing.join(', '));
    }
    
    if (empty.length > 0) {
      console.error('Empty variables:', empty.join(', '));
    }

    // In production, this should fail the deployment
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${[...missing, ...empty].join(', ')}`);
    }
  } else {
    console.log('✅ All required environment variables are set');
    
    // Log Cloudinary configuration (safely)
    console.log('Cloudinary Configuration:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY?.substring(0, 6) + '...',
      has_secret: !!process.env.CLOUDINARY_API_SECRET
    });
  }
};

// Call this in your app startup
export default validateEnvironment;
