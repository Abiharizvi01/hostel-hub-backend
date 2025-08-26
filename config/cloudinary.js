import { v2 as cloudinary } from 'cloudinary';

let isConfigured = false;

// Function to configure Cloudinary when needed
const configureCloudinary = () => {
  if (isConfigured) return;
  
  // Debug: Log the environment variables being used
  console.log('Cloudinary Config - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('Cloudinary Config - API Key:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'undefined');
  console.log('Cloudinary Config - API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'undefined');

  // Debug: Log the exact values being passed to cloudinary.config
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };

  console.log('Cloudinary Config Object:', {
    cloud_name: config.cloud_name,
    api_key: config.api_key ? '***' + config.api_key.slice(-4) : 'undefined',
    api_secret: config.api_secret ? '***' + config.api_secret.slice(-4) : 'undefined'
  });

  cloudinary.config(config);
  isConfigured = true;
};

// Export a configured version
export default {
  ...cloudinary,
  uploader: {
    ...cloudinary.uploader,
    upload_stream: (...args) => {
      configureCloudinary();
      return cloudinary.uploader.upload_stream(...args);
    }
  }
};