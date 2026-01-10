import { Request, Response } from "express";
import { IUsuario } from "@/models/Usuarios";

export interface Authentication {
  Usuario: string, // This will be the email
  Password: string
}

export interface IRol {
  id?: string,
  nombre: string
}
export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string
    correo: string;
    roles: IRol[];
  }
}

export interface UpdatePasswordData {
  correo: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
  success: boolean;
  token?: string;
}

export interface IAuthenticationRepository {
  findByCorreo(correo: string): Promise<IUsuario | null>;
  findById(id: string): Promise<IUsuario | null>;
}

export interface IAuthenticationService {
  verificacion(data: Authentication): Promise<AuthResponse | null>;
  logout(): Promise<void>;
  updatePassword(data: UpdatePasswordData): Promise<UpdatePasswordResponse>;
  getProfile(id: string): Promise<any | null>;
}

export interface IAuthenticationController {
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  updatePassword(req: Request, res: Response): Promise<void>;
  profile(req: Request, res: Response): Promise<void>;
}