import rateLimit from 'express-rate-limit';
import { config } from './env';

/**
 * Rate limiter general para toda la API
 */
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.',
  },
  standardHeaders: true, // Retorna info de rate limit en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
  skip: (req) => {
    // No aplicar rate limit en desarrollo si lo deseas
    return config.server.isDevelopment && req.ip === '::1';
  },
});

/**
 * Rate limiter estricto para endpoints de autenticación
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: {
    error: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
});

/**
 * Rate limiter para creación de recursos
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 creaciones por hora
  message: {
    error: 'Has alcanzado el límite de creación de recursos por hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  generalLimiter,
  authLimiter,
  createLimiter,
};
