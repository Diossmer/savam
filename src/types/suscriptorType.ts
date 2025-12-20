//esquema de la base de datos Usuarios 
export interface Suscriptor {
  id: string;
  numeroTelefono: string;
  estatus: string;
  operador: string;
  fecha: Date;
  whatsapp: boolean;
  telegram: boolean;
  cedula: string;
}

//buscar la data de la base de datos Usuarios en el repositorio
export interface ISuscriptorRepository {
  find(): Promise<Suscriptor[]>;
  create(data: Suscriptor): Promise<Suscriptor>;
  findById(id: string): Promise<Suscriptor | null>;
  update(id: string, data: Suscriptor): Promise<Suscriptor | null>;
}

//esquema de la logica de negocio
export interface ISuscriptorService {
  createSuscriptor(data: Suscriptor): Promise<Suscriptor>;
  findSuscriptor(): Promise<Suscriptor[]>;
  findByIdSuscriptor(id: string): Promise<Suscriptor | null>;
  updateSuscriptor(id: string, data: Suscriptor): Promise<Suscriptor | null>;
}
