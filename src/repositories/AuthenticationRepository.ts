import { IAuthenticationRepository } from "@/types/authType";
import UsuarioModel, { IUsuario } from "@/models/Usuarios";

export class AuthenticationRepository implements IAuthenticationRepository {
  async findByCorreo(correo: string): Promise<IUsuario | null> {
    const usuario = await UsuarioModel.findOne({ correo: correo });
    return usuario;
  }

  async findById(id: string): Promise<IUsuario | null> {
    const usuario = await UsuarioModel.findById(id);
    return usuario;
  }
}
