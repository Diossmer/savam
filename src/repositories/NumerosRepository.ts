import { INumerosRepository, Numeros } from "@/types/numerosType";
import NumerosModel from "@/models/Numeros";

export class NumerosRepository implements INumerosRepository {
  async create(data: Numeros): Promise<Numeros> {
    // Mapear de la interfaz de la API al esquema de MongoDB
    const nuevoUsuario = new NumerosModel({
      cedula: data.cedula,
      estatus: data.estatus,
      numeroTelefono: data.numeroTelefono,
      fecha_creacion: data.fecha_creacion,
      fecha_actualizacion: data.fecha_actualizacion,
    });

    const usuarioGuardado = await nuevoUsuario.save();

    // Mapear de vuelta a la interfaz de la API
    return {
      id: usuarioGuardado._id.toString(),
      cedula: usuarioGuardado.cedula,
      estatus: usuarioGuardado.estatus,
      numeroTelefono: usuarioGuardado.numeroTelefono,
      fecha_creacion: usuarioGuardado.fecha_creacion,
      fecha_actualizacion: usuarioGuardado.fecha_actualizacion,
    };
  }

  async find(): Promise<Numeros[]> {
    const usuarios = await NumerosModel.find().lean();

    // Mapear de MongoDB a la interfaz de la API
    return usuarios.map((usuario: any) => ({
      id: usuario._id.toString(),
      cedula: usuario.cedula,
      estatus: usuario.estatus,
      numeroTelefono: usuario.numeroTelefono,
      fecha_creacion: usuario.fecha_creacion,
      fecha_actualizacion: usuario.fecha_actualizacion,
    }));
  }

  async findById(id: string): Promise<Numeros | null> {
    const usuario = await NumerosModel.findById(id).lean();
    if (!usuario) {
      return null;
    }
    // Mapear de MongoDB a la interfaz de la API
    return {
      id: (usuario as any)._id.toString(),
      cedula: (usuario as any).cedula,
      estatus: (usuario as any).estatus,
      numeroTelefono: (usuario as any).numeroTelefono,
      fecha_creacion: (usuario as any).fecha_creacion,
      fecha_actualizacion: (usuario as any).fecha_actualizacion,
    };
  }

  async update(id: string, data: Numeros): Promise<Numeros | null> {
    const usuario = await NumerosModel.findById(id);
    if (!usuario) {
      return null;
    }
    // Mapear de la interfaz de la API al esquema de MongoDB
    usuario.cedula = data.cedula;
    usuario.estatus = data.estatus;
    usuario.numeroTelefono = data.numeroTelefono;
    usuario.fecha_creacion = data.fecha_creacion;
    usuario.fecha_actualizacion = data.fecha_actualizacion;
    const usuarioGuardado = await usuario.save();
    // Mapear de vuelta a la interfaz de la API
    return {
      id: usuarioGuardado._id.toString(),
      cedula: usuarioGuardado.cedula,
      estatus: usuarioGuardado.estatus,
      numeroTelefono: usuarioGuardado.numeroTelefono,
      fecha_creacion: usuarioGuardado.fecha_creacion,
      fecha_actualizacion: usuarioGuardado.fecha_actualizacion,
    };
  }
}