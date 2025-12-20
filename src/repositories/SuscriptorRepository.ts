import { ISuscriptorRepository, Suscriptor } from "@/types/suscriptorType";
import SuscriptorModel from "@/models/Suscriptor";

export class SuscriptorRepository implements ISuscriptorRepository {
  async create(data: Suscriptor): Promise<Suscriptor> {
    // Mapear de la interfaz de la API al esquema de MongoDB
    const nuevosuscriptor = new SuscriptorModel({
      numeroTelefono: data.numeroTelefono,
      estatus: data.estatus,
      operador: data.operador,
      fecha: data.fecha,
      whatsapp: data.whatsapp,
      telegram: data.telegram,
      cedula: data.cedula,
    });

    const suscriptorGuardado = await nuevosuscriptor.save();

    // Mapear de vuelta a la interfaz de la API
    return {
      id: suscriptorGuardado._id.toString(),
      cedula: suscriptorGuardado.cedula,
      estatus: suscriptorGuardado.estatus,
      operador: suscriptorGuardado.operador,
      numeroTelefono: suscriptorGuardado.numeroTelefono,
      fecha: suscriptorGuardado.fecha,
      whatsapp: suscriptorGuardado.whatsapp,
      telegram: suscriptorGuardado.telegram,
    };
  }

  async find(): Promise<Suscriptor[]> {
    const suscriptors = await SuscriptorModel.find().lean();

    // Mapear de MongoDB a la interfaz de la API
    return suscriptors.map((suscriptor: any) => ({
      id: suscriptor._id.toString(),
      cedula: suscriptor.cedula,
      estatus: suscriptor.estatus,
      operador: suscriptor.operador,
      numeroTelefono: suscriptor.numeroTelefono,
      fecha: suscriptor.fecha,
      whatsapp: suscriptor.whatsapp,
      telegram: suscriptor.telegram,
    }));
  }

  async findById(id: string): Promise<Suscriptor | null> {
    const suscriptor = await SuscriptorModel.findById(id).lean();
    if (!suscriptor) {
      return null;
    }
    // Mapear de MongoDB a la interfaz de la API
    return {
      id: (suscriptor as any)._id.toString(),
      cedula: (suscriptor as any).cedula,
      estatus: (suscriptor as any).estatus,
      operador: (suscriptor as any).operador,
      numeroTelefono: (suscriptor as any).numeroTelefono,
      fecha: (suscriptor as any).fecha,
      whatsapp: (suscriptor as any).whatsapp,
      telegram: (suscriptor as any).telegram,
    };
  }

  async update(id: string, data: Suscriptor): Promise<Suscriptor | null> {
    const suscriptor = await SuscriptorModel.findById(id);
    if (!suscriptor) {
      return null;
    }
    // Mapear de la interfaz de la API al esquema de MongoDB
    suscriptor.cedula = data.cedula;
    suscriptor.estatus = data.estatus;
    suscriptor.operador = data.operador;
    suscriptor.numeroTelefono = data.numeroTelefono;
    suscriptor.fecha = data.fecha;
    suscriptor.whatsapp = data.whatsapp;
    suscriptor.telegram = data.telegram;
    const suscriptorGuardado = await suscriptor.save();
    // Mapear de vuelta a la interfaz de la API
    return {
      id: suscriptorGuardado._id.toString(),
      cedula: suscriptorGuardado.cedula,
      estatus: suscriptorGuardado.estatus,
      operador: suscriptorGuardado.operador,
      numeroTelefono: suscriptorGuardado.numeroTelefono,
      fecha: suscriptorGuardado.fecha,
      whatsapp: suscriptorGuardado.whatsapp,
      telegram: suscriptorGuardado.telegram,
    };
  }
}