import { Router } from "express";
import usuariosRoutes from "@/routes/UsuariosRouter";
import rolesRoutes from "@/routes/RolesRouter";
import numerosRoutes from "@/routes/NumerosRouter";
import suscriptorRoutes from "@/routes/SuscriptorRouter";
import authenticationRouter from "@/routes/AuthenticationRouter";

export default () => {
  const router = Router();

  // Rutas para Usuarios
  usuariosRoutes(router);

  // Rutas para Roles
  rolesRoutes(router);

  // Rutas para Numeros
  numerosRoutes(router);

  // Rutas para Suscriptor
  suscriptorRoutes(router);

  // Rutas para Autenticacion
  router.use(authenticationRouter);

  return router;
};