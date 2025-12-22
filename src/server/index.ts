import app from '@/app';
import { config } from '@/config/env';
import setupGracefulShutdown from './gracefulShutdown';

const PORT = config.server.port;
const HOST = config.server.host;

const server = app.listen(PORT, HOST, () => {
  console.log('🚀 ========================================');
  console.log(`🖥️  Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`📝 Entorno: ${config.server.nodeEnv}`);
  console.log(`🔗 API Base: http://${HOST}:${PORT}/api`);
  console.log(`💚 Health Check: http://${HOST}:${PORT}/health`);
  console.log('🚀 ========================================');
});

// Configurar cierre graceful del servidor
setupGracefulShutdown(server);