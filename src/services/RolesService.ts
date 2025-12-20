import { IRolesRepository, IRolesService, Roles } from "@/types/rolesType";

//Servicio (Lógica de negocio)
export class RolesService implements IRolesService {
  //inyeccion de dependencias
  private rolesRepository: IRolesRepository;

  // constructor
  constructor(rolesRepository: IRolesRepository) {
    this.rolesRepository = rolesRepository;
  }

  //metodos de la logica de negocio
  createRoles(data: Roles): Promise<Roles> {
    return this.rolesRepository.createRoles(data);
  }

  findRoles(): Promise<Roles[]> {
    return this.rolesRepository.findRoles();
  }

  findByIdRoles(id: string): Promise<Roles | null> {
    return this.rolesRepository.findByIdRoles(id);
  }

  updateRoles(id: string, data: Roles): Promise<Roles | null> {
    return this.rolesRepository.updateRoles(id, data);
  }

  deleteRoles(id: string): Promise<Roles | null> {
    return this.rolesRepository.deleteRoles(id);
  }
}
