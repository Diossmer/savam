// Cargar variables de entorno
process.loadEnvFile();

/**
 * Configuración centralizada de variables de entorno
 * Valida y exporta todas las variables de entorno necesarias
 */
export const config = {
  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Configuración de MongoDB
  database: {
    url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/savam',
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Configuración de Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests por ventana
  },

  // Configuración de Bcrypt
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
};

/**
 * Valida que todas las variables de entorno críticas estén presentes
 */
export const validateEnv = (): void => {
  const requiredEnvVars: string[] = [];

  // En producción, estas variables son obligatorias
  if (config.server.isProduction) {
    requiredEnvVars.push('JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGO_URL');
  }

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Faltan las siguientes variables de entorno obligatorias:');
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  // Advertencias para desarrollo
  if (config.server.isDevelopment) {
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️  JWT_SECRET no está definido, usando valor por defecto (NO usar en producción)');
    }
    if (!process.env.MONGO_URL) {
      console.warn('⚠️  MONGO_URL no está definido, usando URL por defecto');
    }
  }
};

export default config;
