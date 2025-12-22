import { Authentication, IAuthenticationRepository, IAuthenticationService, AuthResponse, UpdatePasswordData, UpdatePasswordResponse } from "@/types/authType";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//logica de negocio
export class AuthenticationServices implements IAuthenticationService {
  //inyeccion de dependencias
  private authenticationRepository: IAuthenticationRepository;

  // constructor
  constructor(authenticationRepository: IAuthenticationRepository) {
    this.authenticationRepository = authenticationRepository;
  }

  //metodos de la logica de negocio
  async verificacion(data: Authentication): Promise<AuthResponse | null> {
    const usuario = await this.authenticationRepository.findByCorreo(data.Usuario);

    if (!usuario) {
      return null;
    }

    const passwordValido = bcrypt.compareSync(data.Password, usuario.password);

    if (!passwordValido) {
      return null;
    }

    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo, roles: usuario.roles },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1h" }
    );

    return {
      token,
      usuario: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        roles: usuario.roles.length > 0 ? (usuario.roles[0] as any).nombre || usuario.roles[0].toString() : null
      }
    };
  }

  async logout(): Promise<void> {
    return;
  }

  async updatePassword(data: UpdatePasswordData): Promise<UpdatePasswordResponse> {
    const usuario = await this.authenticationRepository.findByCorreo(data.correo);

    if (!usuario) {
      return { success: false, message: "Usuario no encontrado" };
    }

    const passwordValido = bcrypt.compareSync(data.currentPassword, usuario.password);

    if (!passwordValido) {
      return { success: false, message: "Contraseña actual incorrecta" };
    }

    try {
      usuario.password = bcrypt.hashSync(data.newPassword, 10);
      await usuario.save();

      // Generar nuevo token para el "refresh"
      const token = jwt.sign(
        { id: usuario._id, correo: usuario.correo, roles: usuario.roles },
        process.env.JWT_SECRET || "secreto",
        { expiresIn: "1h" }
      );

      return {
        success: true,
        message: "Contraseña actualizada exitosamente",
        token: token
      };
    } catch (error: any) {
      return { success: false, message: `Error al actualizar: ${error.message}` };
    }
  }

  async getProfile(id: string): Promise<any | null> {
    const usuario = await this.authenticationRepository.findById(id);

    if (!usuario) {
      return null;
    }

    const rolesMapped = usuario.roles.map((role: any) => {
      if (typeof role === 'object' && role.nombre) {
        return {
          id: role._id ? role._id.toString() : (role.id || ''),
          nombre: role.nombre,
          descripcion: role.descripcion,
          permisos: role.permisos
        };
      }
      return role.toString();
    });

    return {
      id: usuario._id.toString(),
      oficina: usuario.oficina,
      correo: usuario.correo,
      estado: usuario.estado,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: usuario.cedula,
      roles: rolesMapped.length > 0 ? rolesMapped[0] : null
    };
  }
}
