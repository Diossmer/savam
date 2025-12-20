import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { config } from '@/config/env';

const router = Router();

/**
 * Health check básico - verifica que el servidor esté corriendo
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Health check completo - verifica servidor y dependencias
 */
router.get('/health/full', async (_req: Request, res: Response) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
    services: {
      database: {
        status: 'unknown',
        name: '',
      },
    },
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      unit: 'MB',
    },
  };

  try {
    // Verificar conexión a MongoDB
    const dbState = mongoose.connection.readyState;
    healthCheck.services.database.status = dbState === 1 ? 'connected' : 'disconnected';
    healthCheck.services.database.name = mongoose.connection.name || 'N/A';

    if (dbState !== 1) {
      healthCheck.status = 'degraded';
      return res.status(503).json(healthCheck);
    }

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'error';
    res.status(503).json(healthCheck);
  }
});

/**
 * Readiness check - verifica si el servidor está listo para recibir tráfico
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Verificar que MongoDB esté conectado
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ready: false,
        reason: 'Database not connected',
      });
    }

    res.status(200).json({
      ready: true,
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: 'Service unavailable',
    });
  }
});

/**
 * Liveness check - verifica que el servidor esté vivo
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    alive: true,
  });
});

export default router;
