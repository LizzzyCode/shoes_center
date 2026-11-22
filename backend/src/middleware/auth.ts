import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return 'super_secret_jwt_key_123';
}

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      console.error('Auth configuration error:', error.message);
      res.status(500).json({ message: 'Konfigurasi autentikasi server belum lengkap.' });
      return;
    }
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak. Anda bukan admin.' });
  }
};
