import { IUsuarioRepository, Usuarios } from "@/types/usuariosType";
import UsuarioModel from "@/models/Usuarios";
import bcrypt from "bcryptjs";
// Repositorio (Interaction con la base de datos)
export class UsuariosRepository implements IUsuarioRepository {
  // Helper para convertir roles (DBRef o ObjectId) a string[]
  private rolesAString(roles: any): string[] {
    // Verificar si roles existe y es un array
    if (!roles) return [];
    if (!Array.isArray(roles)) return [];
    if (roles.length === 0) return [];

    return roles.map(rol => {
      // Si es null o undefined, retornar vacío
      if (!rol) return '';

      // Si es un DBRef, extraer el oid
      if (typeof rol === 'object' && rol.oid) {
        return rol.oid.toString();
      }
      // Si tiene $id (formato alternativo de DBRef)
      if (typeof rol === 'object' && rol.$id) {
        return rol.$id.toString();
      }
      // Si es un ObjectId normal o tiene método toString
      if (rol.toString) {
        return rol.toString();
      }
      return '';
    }).filter(id => id !== '');
  }

  // private usuario:[] = [] //guardar en memoria
  async create(data: Usuarios): Promise<Usuarios> {
    // Mapear de la interfaz de la API al esquema de MongoDB
    const nuevoUsuario = new UsuarioModel({
      oficina: data.oficina,
      correo: data.correo,
      estado: data.estado,
      nombre: data.nombre,
      apellido: data.apellido,
      cedula: data.cedula,
      password: bcrypt.hashSync(data.password, 10),
      roles: data.roles || [],
    });

    const usuarioGuardado = await nuevoUsuario.save();

    // Mapear de vuelta a la interfaz de la API
    return {
      id: usuarioGuardado._id.toString(),
      oficina: usuarioGuardado.oficina,
      correo: usuarioGuardado.correo,
      estado: usuarioGuardado.estado,
      nombre: usuarioGuardado.nombre,
      apellido: usuarioGuardado.apellido,
      cedula: usuarioGuardado.cedula,
      password: usuarioGuardado.password,
      roles: this.rolesAString(usuarioGuardado.roles),
    };
  }

  async find(): Promise<Usuarios[]> {
    const usuarios = await UsuarioModel.find().lean();

    // Mapear de MongoDB a la interfaz de la API
    return usuarios.map((usuario: any) => ({
      id: usuario._id.toString(),
      oficina: usuario.oficina,
      correo: usuario.correo,
      estado: usuario.estado,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: usuario.cedula,
      password: usuario.password,
      roles: this.rolesAString(usuario.roles),
    }));
  }

  async findById(id: string): Promise<Usuarios | null> {
    const usuario = await UsuarioModel.findById(id).lean();
    if (!usuario) {
      return null;
    }
    // Mapear de MongoDB a la interfaz de la API
    return {
      id: (usuario as any)._id.toString(),
      oficina: (usuario as any).oficina,
      correo: (usuario as any).correo,
      estado: (usuario as any).estado,
      nombre: (usuario as any).nombre,
      apellido: (usuario as any).apellido,
      cedula: (usuario as any).cedula,
      password: (usuario as any).password,
      roles: this.rolesAString((usuario as any).roles),
    };
  }

  async update(id: string, data: Usuarios): Promise<Usuarios | null> {
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return null;
    }
    // Mapear de la interfaz de la API al esquema de MongoDB
    usuario.oficina = data.oficina;
    usuario.correo = data.correo;
    usuario.estado = data.estado;
    usuario.nombre = data.nombre;
    usuario.apellido = data.apellido;
    usuario.cedula = data.cedula;
    usuario.password = bcrypt.hashSync(data.password, 10)
    if (data.roles) {
      usuario.roles = data.roles as any;
    }
    const usuarioGuardado = await usuario.save();
    // Mapear de vuelta a la interfaz de la API
    return {
      id: usuarioGuardado._id.toString(),
      oficina: usuarioGuardado.oficina,
      correo: usuarioGuardado.correo,
      estado: usuarioGuardado.estado,
      nombre: usuarioGuardado.nombre,
      apellido: usuarioGuardado.apellido,
      cedula: usuarioGuardado.cedula,
      password: usuarioGuardado.password,
      roles: this.rolesAString(usuarioGuardado.roles),
    };
  }

  async delete(id: string): Promise<Usuarios | null> {
    const usuario = await UsuarioModel.findByIdAndDelete(id);
    if (!usuario) {
      return null;
    }
    // Mapear de MongoDB a la interfaz de la API
    return {
      id: usuario._id.toString(),
      oficina: usuario.oficina,
      correo: usuario.correo,
      estado: usuario.estado,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: usuario.cedula,
      password: usuario.password,
      roles: this.rolesAString(usuario.roles),
    };
  }
}