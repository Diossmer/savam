import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

/**
 * Interfaz para el payload del JWT
 */
export interface JwtPayload {
  id: string;
  correo?: string;
  roles?: string[];
}

/**
 * Extender Request de Express para incluir user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware para validar JWT
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Token de autenticación requerido',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Token inválido o expirado',
      },
    });
  }
};

/**
 * Middleware para validar roles
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Usuario no autenticado',
        },
      });
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tienes permisos para acceder a este recurso',
        },
      });
    }

    next();
  };
};

export default { authenticateToken, authorizeRoles };
