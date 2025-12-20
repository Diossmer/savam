import { Repository } from "./repositoriesType";
//esquema de la base de datos Usuarios 
export interface Numeros {
  id: string;
  cedula: string;
  estatus: string;
  numeroTelefono: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

//buscar la data de la base de datos Usuarios en el repositorio
export interface INumerosRepository {
  find(): Promise<Numeros[]>;
  create(data: Numeros): Promise<Numeros>;
  //completando el crud
  findById(id: string): Promise<Numeros | null>;
  update(id: string, data: Numeros): Promise<Numeros | null>;
}

//esquema de la logica de negocio
export interface INumerosService {
  //2metodos
  createNumeros(data: Numeros): Promise<Numeros>;
  findNumeros(): Promise<Numeros[]>;
  //completando crud
  findByIdNumeros(id: string): Promise<Numeros | null>;
  updateNumeros(id: string, data: Numeros): Promise<Numeros | null>;
}
