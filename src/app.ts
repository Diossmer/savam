import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "@/routes";
import connectDB from "@/config";
import { validateEnv } from "@/config/env";
import corsOptions from "@/config/cors";
import helmetOptions from "@/config/security";
import { generalLimiter } from "@/config/rateLimit";
import healthCheckRoutes from "@/server/healthCheck";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";

/**
 * Validar variables de entorno
 */
validateEnv();

/**
 * Conectar a MongoDB
 */
connectDB();

const app: Application = express();

/**
 * Middlewares de seguridad
 */
app.use(helmet(helmetOptions)); // Seguridad HTTP headers
app.use(cors(corsOptions)); // CORS
app.use(generalLimiter); // Rate limiting

/**
 * Middlewares de parseo
 */
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

/**
 * Middleware de logging
 */
app.use(morgan("dev"));

/**
 * Health check routes (sin prefijo /api)
 */
app.use(healthCheckRoutes);

/**
 * API Routes
 */
app.use('/api', routes());

/**
 * Manejadores de errores (deben ir al final)
 */
app.use(notFoundHandler); // 404
app.use(errorHandler); // Errores generales

export default app;