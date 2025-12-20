import { Request, Response } from "express";
import { IUsuario } from "@/models/Usuarios";

export interface Authentication {
  Usuario: string, // This will be the email
  Password: string
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    roles: string[];
  }
}

export interface IAuthenticationRepository {
  findByCorreo(correo: string): Promise<IUsuario | null>;
}

export interface IAuthenticationService {
  verificacion(data: Authentication): Promise<AuthResponse | null>;
}

export interface IAuthenticationController {
  login(req: Request, res: Response): Promise<void>;
}