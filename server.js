import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // 1. Import cors
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import postRoutes from './routes/postRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js'; // 1. Import notice routes
import menuRoutes from './routes/menuRoutes.js'; // 1. Import menu routes
import billRoutes from './routes/billRoutes.js'; // 1. Import bill routes
import wardenRoutes from './routes/wardenRoutes.js'; // 1. Import warden routes
import canteenRoutes from './routes/canteenRoutes.js'; // 1. Import canteen routes

dotenv.config();

// Connect to our MongoDB database
connectDB();

// Initialize our Express application
const app = express();
app.use(cors()); // 2. Use cors middleware

// This allows us to accept JSON data in the body
app.use(express.json());

// A simple test route to see if the server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use the auth routes
app.use('/api/auth', authRoutes);

// Use the complaint routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notices', noticeRoutes); // 2. Use notice routes
app.use('/api/menu', menuRoutes); // 2. Use menu routes
app.use('/api/bills', billRoutes); // 2. Use bill routes
app.use('/api/warden', wardenRoutes); // 2. Use warden routes
app.use('/api/canteen', canteenRoutes); // 2. Use canteen routes


// Get the port from our .env file, or use 5000 as a default
const PORT = process.env.PORT || 5000;

// Start the server and listen for connections on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));