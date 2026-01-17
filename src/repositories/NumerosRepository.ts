import { INumerosRepository, Numeros } from "@/types/numerosType";
import NumerosModel from "@/models/Numeros";

export class NumerosRepository implements INumerosRepository {
  async create(data: Numeros): Promise<Numeros> {
    // Mapear de la interfaz de la API al esquema de MongoDB
    const nuevoUsuario = new NumerosModel({
      cedula: data.cedula,
      numero: data.numero,
      fechaDeConsulta: data.fechaDeConsulta,
    });

    const usuarioGuardado = await nuevoUsuario.save();

    // Mapear de vuelta a la interfaz de la API
    return {
      id: usuarioGuardado._id.toString(),
      cedula: usuarioGuardado.cedula,
      numero: usuarioGuardado.numero,
      fechaDeConsulta: usuarioGuardado.fechaDeConsulta,
    };
  }

  async find(): Promise<Numeros[]> {
    const usuarios = await NumerosModel.find().lean();

    // Mapear de MongoDB a la interfaz de la API
    return usuarios.map((usuario: any) => ({
      id: usuario._id.toString(),
      cedula: usuario.cedula,
      estatus: usuario.estatus,
      numero: usuario.numero,
      fechaDeConsulta: usuario.fechaDeConsulta,
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
      numero: (usuario as any).numero,
      fechaDeConsulta: (usuario as any).fechaDeConsulta,
    };
  }

  async update(id: string, data: Numeros): Promise<Numeros | null> {
    const usuario = await NumerosModel.findById(id);
    if (!usuario) {
      return null;
    }
    // Mapear de la interfaz de la API al esquema de MongoDB
    usuario.cedula = data.cedula;
    usuario.numero = data.numero;
    usuario.fechaDeConsulta = data.fechaDeConsulta;
    const usuarioGuardado = await usuario.save();
    // Mapear de vuelta a la interfaz de la API
    return {
      id: usuarioGuardado._id.toString(),
      cedula: usuarioGuardado.cedula,
      numero: usuarioGuardado.numero,
      fechaDeConsulta: usuarioGuardado.fechaDeConsulta,
    };
  }
}