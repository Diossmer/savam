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
}
