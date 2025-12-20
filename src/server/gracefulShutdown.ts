import { Server } from 'http';
import mongoose from 'mongoose';

/**
 * Maneja el cierre graceful del servidor
 * Cierra conexiones activas antes de terminar el proceso
 */
export const setupGracefulShutdown = (server: Server): void => {
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} recibido, cerrando servidor...`);

    // Cerrar servidor HTTP (no acepta nuevas conexiones)
    server.close(async () => {
      console.log('✅ Servidor HTTP cerrado');

      try {
        // Cerrar conexión a MongoDB
        await mongoose.connection.close();
        console.log('✅ Conexión a MongoDB cerrada');

        console.log('👋 Proceso terminado correctamente');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error al cerrar conexiones:', error);
        process.exit(1);
      }
    });

    // Forzar cierre después de 10 segundos
    setTimeout(() => {
      console.error('⚠️  Forzando cierre del servidor (timeout alcanzado)');
      process.exit(1);
    }, 10000);
  };

  // Escuchar señales de terminación
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', promise, 'razón:', reason);
    shutdown('unhandledRejection');
  });
};

export default setupGracefulShutdown;
