import { Router } from "express";
import { RolesController } from "@/controllers/RolesController";
import { RolesRepository } from "@/repositories/RolesRepository";
import { RolesService } from "@/services/RolesService";
import { IRolesRepository, IRolesService } from "@/types/rolesType";

// Instanciación de dependencias para Roles
const rolesRepository: IRolesRepository = new RolesRepository();
const rolesService: IRolesService = new RolesService(rolesRepository);
const rolesController = new RolesController(rolesService);

export default (router: Router) => {
  // Rutas para Roles
  router.post('/roles', rolesController.storeRoles);
  router.get('/roles', rolesController.indexListRoles);
  router.get('/roles/:id', rolesController.indexListRolesById);
  router.put('/roles/:id', rolesController.updateRolesById);
  router.delete('/roles/:id', rolesController.deleteRolesById);
}