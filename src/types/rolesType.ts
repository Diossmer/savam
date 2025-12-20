//esquema de la base de datos Roles 
export interface Roles {
    id: string,
    nombre: String,
    descripcion: Text,
    permisos: Object
}

//buscar la data de la base de datos Roles en el repositorio
export interface IRolesRepository {
    createRoles(data: Roles): Promise<Roles>;
    findRoles(): Promise<Roles[]>;
    findByIdRoles(id: string): Promise<Roles | null>;
    updateRoles(id: string, data: Roles): Promise<Roles | null>;
    deleteRoles(id: string): Promise<Roles | null>;
}

//esquema de la logica de negocio
export interface IRolesService {
    //metodos
    findRoles(): Promise<Roles[]>;
    createRoles(data: Roles): Promise<Roles>;
    findByIdRoles(id: string): Promise<Roles | null>;
    updateRoles(id: string, data: Roles): Promise<Roles | null>;
    deleteRoles(id: string): Promise<Roles | null>;
}