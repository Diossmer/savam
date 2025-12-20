import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para logging de requests
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
};

export default requestLogger;
