import { IAuthenticationService, IAuthenticationController } from "@/types/authType";
import { Request, Response } from "express";
import { logger } from "@/config/logger";

export class AuthenticationController implements IAuthenticationController {
  private authenticationService: IAuthenticationService;

  constructor(authenticationService: IAuthenticationService) {
    this.authenticationService = authenticationService;
  }

  login = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[AuthenticationController] [login] - Intento de inicio de sesión - Usuario: ${req.body.Usuario}`);
    try {
      const { Usuario, Password } = req.body;
      if (!Usuario || !Password) {
        logger.sistema(`[AuthenticationController] [login] - Intento fallido: Faltan credenciales`);
        res.status(400).json({ message: "Usuario y Password son requeridos" });
        return;
      }

      const authResponse = await this.authenticationService.verificacion({ Usuario, Password });

      if (!authResponse) {
        logger.sistema(`[AuthenticationController] [login] - Credenciales inválidas para usuario: ${Usuario}`);
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      logger.usuario(`Inicio de sesión exitoso - Usuario: ${Usuario}`);
      res.status(200).json(authResponse);
    } catch (error) {
      logger.error("Error en el servidor durante login", error);
      res.status(500).json({ message: "Error en el servidor", error: error instanceof Error ? error.message : String(error) });
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[AuthenticationController] [logout] - Cierre de sesión solicitado`);
    try {
      await this.authenticationService.logout();
      res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
      logger.error("Error en el servidor durante logout", error);
      res.status(500).json({ message: "Error en el servidor", error: error instanceof Error ? error.message : String(error) });
    }
  }

  updatePassword = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[AuthenticationController] [updatePassword] - Intento de actualización de contraseña`);
    try {
      const { currentPassword, newPassword } = req.body;
      const correo = req.user?.correo || req.body.correo;

      if (!correo || !currentPassword || !newPassword) {
        res.status(400).json({ message: "Correo, contraseña actual y nueva contraseña son requeridos" });
        return;
      }

      const response = await this.authenticationService.updatePassword({ correo, currentPassword, newPassword });

      if (!response.success) {
        res.status(400).json(response);
        return;
      }

      logger.usuario(`Contraseña actualizada para usuario: ${correo}`);
      res.status(200).json(response);
    } catch (error) {
      logger.error("Error en el servidor durante updatePassword", error);
      res.status(500).json({ message: "Error en el servidor", error: error instanceof Error ? error.message : String(error) });
    }
  }

  profile = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[AuthenticationController] [profile] - Solicitud de perfil para ID: ${req.user?.id}`);
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "No autorizado" });
        return;
      }

      const userProfile = await this.authenticationService.getProfile(userId);

      if (!userProfile) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      res.status(200).json(userProfile);
    } catch (error) {
      logger.error("Error en el servidor durante profile", error);
      res.status(500).json({ message: "Error en el servidor", error: error instanceof Error ? error.message : String(error) });
    }
  }
}
