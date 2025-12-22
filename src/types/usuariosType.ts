import { Repository } from "./repositoriesType";
//esquema de la base de datos Usuarios 
export interface Usuarios {
  id: string;
  oficina: string;
  correo: string;
  estado: string;
  nombre: string;
  apellido: string;
  cedula: string;
  password: string;
  roles: any;
}

//buscar la data de la base de datos Usuarios en el repositorio
export interface IUsuarioRepository extends Repository<Usuarios> { }

//esquema de la logica de negocio
export interface IUsuarioService {
  //2metodos
  createUsuario(data: Usuarios): Promise<Usuarios>;
  findUsuarios(): Promise<Usuarios[]>;
  //completando crud
  findByIdUsuario(id: string): Promise<Usuarios | null>;
  updateUsuario(id: string, data: Usuarios): Promise<Usuarios | null>;
  deleteUsuario(id: string): Promise<Usuarios | null>;
}