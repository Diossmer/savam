import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para manejar errores de forma centralizada
 */
export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Log del error
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Respuesta al cliente
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.url}`,
    },
  });
};

export default { errorHandler, notFoundHandler };
