import { Request, Response, NextFunction } from 'express';
import { AuthService } from './authService';


// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      email?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing or invalid token' });
    return;
  }

  const token = authHeader.slice(7);
  const payload = AuthService.verifyToken(token);

  if (!payload) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  req.userId = payload.userId;
  req.email = payload.email;
  next();
};
