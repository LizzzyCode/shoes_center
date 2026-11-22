import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/product.js';
import checkoutRoutes from './routes/checkout.js';
import profileRoutes from './routes/profileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testimoniRoutes from './routes/testimoniRoutes.js';
import notifikasiRoutes from './routes/notifikasiRoutes.js';
import { prisma } from './lib/prisma.js';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req: Request, res: Response) => {
  const env = {
    databaseUrl: Boolean(process.env.DATABASE_URL),
    jwtSecret: Boolean(process.env.JWT_SECRET),
    cloudinary: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
    midtrans: Boolean(process.env.MIDTRANS_SERVER_KEY),
  };

  if (!env.databaseUrl) {
    res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      reason: 'DATABASE_URL environment variable is not set',
      env,
    });
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      env,
    });
  } catch (error) {
    console.error('Health check database error:', error);
    res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      reason: 'Database connection failed',
      env,
    });
  }
});

app.use('/api/auth', authRoutes);

// Register product routes
app.use('/api/products', productRoutes);

// Register checkout routes
app.use('/api/checkout', checkoutRoutes);

// history pemesanan barang
app.use('/api/orders', orderRoutes);

// Register profile routes
app.use('/api/profile', profileRoutes);

// Register user routes
app.use('/api/users', userRoutes);

// Register testimoni routes
app.use('/api/testimoni', testimoniRoutes);

// Register notifikasi routes
app.use('/api/notifikasi', notifikasiRoutes);

// Setup static folder for uploads

app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Ensure unhandled Express/middleware errors return JSON instead of HTML
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled backend error:', err);
  res.status(500).json({
    message: err.message || 'Terjadi kesalahan pada server',
  });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
