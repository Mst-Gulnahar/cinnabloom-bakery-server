import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import foodRoutes from './routes/foodRoutes';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes'; // 1. Import Auth Routes

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes); // 2. Mount Auth Routes

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});