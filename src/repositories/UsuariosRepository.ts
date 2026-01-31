import { IUsuarioRepository, Usuarios } from "@/types/usuariosType";
import UsuarioModel from "@/models/Usuarios";
import bcrypt from "bcryptjs";
// Repositorio (Interaction con la base de datos)
export class UsuariosRepository implements IUsuarioRepository {
  // Helper para convertir roles (DBRef o ObjectId o Objeto Poblado) a (string | any)[]
  private rolesAData(roles: any): (string | any)[] {
    // Verificar si roles existe y es un array
    if (!roles) return [];
    if (!Array.isArray(roles)) return [];
    if (roles.length === 0) return [];

    return roles.map(rol => {
      // Si es null o undefined, retornar vacío
      if (!rol) return '';

      // Si es un objeto que ya tiene nombre (poblado), devolverlo completo
      if (typeof rol === 'object' && rol.nombre) {
        return {
          id: rol._id ? rol._id.toString() : (rol.id || ''),
          nombre: rol.nombre,
          descripcion: rol.descripcion,
          permisos: rol.permisos
        };
      }

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
    }).filter(data => data !== '');
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
      password: data.password ? bcrypt.hashSync(data.password, 10) : '',
      roles: data.roles || [],
    });

    const usuarioGuardado = await (await nuevoUsuario.save()).populate('roles');

    // Mapear de vuelta a la interfaz de la API
    const rolesData = this.rolesAData(usuarioGuardado.roles);
    return {
      id: usuarioGuardado._id.toString(),
      oficina: usuarioGuardado.oficina,
      correo: usuarioGuardado.correo,
      estado: usuarioGuardado.estado,
      nombre: usuarioGuardado.nombre,
      apellido: usuarioGuardado.apellido,
      cedula: usuarioGuardado.cedula,
      password: usuarioGuardado.password,
      roles: rolesData.length > 0 ? rolesData[0] : null,
    };
  }

  async find(): Promise<Usuarios[]> {
    const usuarios = await UsuarioModel.find().sort({ createdAt: -1 }).populate('roles').lean();

    // Mapear de MongoDB a la interfaz de la API
    return usuarios.map((usuario: any) => {
      const rolesData = this.rolesAData(usuario.roles);
      return {
        id: usuario._id.toString(),
        oficina: usuario.oficina,
        correo: usuario.correo,
        estado: usuario.estado,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        cedula: usuario.cedula,
        password: usuario.password,
        roles: rolesData.length > 0 ? rolesData[0] : null,
      };
    });
  }

  async findById(id: string): Promise<Usuarios | null> {
    const usuario = await UsuarioModel.findById(id).populate('roles').lean();
    if (!usuario) {
      return null;
    }
    // Mapear de MongoDB a la interfaz de la API
    const rolesData = this.rolesAData((usuario as any).roles);
    return {
      id: (usuario as any)._id.toString(),
      oficina: (usuario as any).oficina,
      correo: (usuario as any).correo,
      estado: (usuario as any).estado,
      nombre: (usuario as any).nombre,
      apellido: (usuario as any).apellido,
      cedula: (usuario as any).cedula,
      password: (usuario as any).password,
      roles: rolesData.length > 0 ? rolesData[0] : null,
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

    if (data.password) {
      usuario.password = bcrypt.hashSync(data.password, 10);
    }

    if (data.roles) {
      usuario.roles = data.roles as any;
    }
    const usuarioGuardado = await (await usuario.save()).populate('roles');
    // Mapear de vuelta a la interfaz de la API
    const rolesData = this.rolesAData(usuarioGuardado.roles);
    return {
      id: usuarioGuardado._id.toString(),
      oficina: usuarioGuardado.oficina,
      correo: usuarioGuardado.correo,
      estado: usuarioGuardado.estado,
      nombre: usuarioGuardado.nombre,
      apellido: usuarioGuardado.apellido,
      cedula: usuarioGuardado.cedula,
      password: usuarioGuardado.password,
      roles: rolesData.length > 0 ? rolesData[0] : null,
    };
  }

  async delete(id: string): Promise<Usuarios | null> {
    const usuario = await UsuarioModel.findByIdAndDelete(id).populate('roles');
    if (!usuario) {
      return null;
    }
    // Mapear de MongoDB a la interfaz de la API
    const rolesData = this.rolesAData(usuario.roles);
    return {
      id: usuario._id.toString(),
      oficina: usuario.oficina,
      correo: usuario.correo,
      estado: usuario.estado,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: usuario.cedula,
      password: usuario.password,
      roles: rolesData.length > 0 ? rolesData[0] : null,
    };
  }
}