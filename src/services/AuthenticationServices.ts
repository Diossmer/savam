import { Authentication, IAuthenticationRepository, IAuthenticationService, AuthResponse } from "@/types/authType";
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
        roles: usuario.roles.map(role => role.toString())
      }
    };
  }
}