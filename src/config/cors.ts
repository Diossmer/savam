import { CorsOptions } from 'cors';
import { config } from './env';

/**
 * Configuración de CORS para la API
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // En desarrollo, permitir todos los orígenes
    if (config.server.isDevelopment) {
      return callback(null, true);
    }

    // En producción, validar contra lista blanca
    const allowedOrigins = config.cors.origin.split(',');

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 horas
};

export default corsOptions;
