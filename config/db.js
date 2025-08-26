import mongoose from 'mongoose';

// This function will connect to our database
const connectDB = async () => {
  try {
    // We try to connect using the MONGO_URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, we log the error and exit the process
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;