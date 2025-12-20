import { Request, Response } from "express";
import { IRolesService } from "@/types/rolesType";
import { logger } from "@/config/logger";

export class RolesController {
  private rolesService: IRolesService;

  constructor(rolesService: IRolesService) {
    this.rolesService = rolesService;
  }

  // Crear un nuevo rol
  storeRoles = async (req: Request, res: Response): Promise<void> => {
    logger.sistema("[RolesController] [storeRoles] - Iniciando creación de rol");
    try {
      const nuevoRol = await this.rolesService.createRoles(req.body);
      logger.usuario(`Rol creado exitosamente - ID: ${nuevoRol.id}`, { nombre: nuevoRol.nombre });
      res.status(201).json(nuevoRol);
    } catch (error) {
      logger.error("Error al crear el rol", error);
      res.status(500).json({ message: "Error al crear el rol", error });
    }
  };

  // Obtener todos los roles
  indexListRoles = async (req: Request, res: Response): Promise<void> => {
    logger.sistema("[RolesController] [indexListRoles] - Obteniendo lista de roles");
    try {
      const roles = await this.rolesService.findRoles();
      logger.sistema(`[RolesController] [indexListRoles] - Roles recuperados: ${roles.length}`);
      res.status(200).json(roles);
    } catch (error) {
      logger.error("Error al obtener los roles", error);
      res.status(500).json({ message: "Error al obtener los roles", error });
    }
  };

  // Obtener un rol por ID
  indexListRolesById = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[RolesController] [indexListRolesById] - Buscando rol ID: ${req.params.id}`);
    try {
      const rol = await this.rolesService.findByIdRoles(req.params.id);
      if (!rol) {
        logger.sistema(`[RolesController] [indexListRolesById] - Rol no encontrado ID: ${req.params.id}`);
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }
      logger.sistema(`[RolesController] [indexListRolesById] - Rol encontrado: ${rol.nombre}`);
      res.status(200).json(rol);
    } catch (error) {
      logger.error(`Error al obtener el rol ID ${req.params.id}`, error);
      res.status(500).json({ message: "Error al obtener el rol", error });
    }
  };

  // Actualizar un rol por ID
  updateRolesById = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[RolesController] [updateRolesById] - Iniciando actualización de rol ID: ${req.params.id}`);
    try {
      const rolActualizado = await this.rolesService.updateRoles(
        req.params.id,
        req.body
      );
      if (!rolActualizado) {
        logger.sistema(`[RolesController] [updateRolesById] - Rol no encontrado para actualizar ID: ${req.params.id}`);
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }
      logger.usuario(`Rol actualizado exitosamente - ID: ${rolActualizado.id}`, { nombre: rolActualizado.nombre });
      res.status(200).json(rolActualizado);
    } catch (error) {
      logger.error(`Error al actualizar el rol ID ${req.params.id}`, error);
      res.status(500).json({ message: "Error al actualizar el rol", error });
    }
  };

  // Eliminar un rol por ID
  deleteRolesById = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[RolesController] [deleteRolesById] - Iniciando eliminación de rol ID: ${req.params.id}`);
    try {
      const rolEliminado = await this.rolesService.deleteRoles(req.params.id);
      if (!rolEliminado) {
        logger.sistema(`[RolesController] [deleteRolesById] - Rol no encontrado para eliminar ID: ${req.params.id}`);
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }
      logger.usuario(`Rol eliminado exitosamente - ID: ${rolEliminado.id}`, { nombre: rolEliminado.nombre });
      res.status(200).json({ message: "Rol eliminado exitosamente", rol: rolEliminado });
    } catch (error) {
      logger.error(`Error al eliminar el rol ID ${req.params.id}`, error);
      res.status(500).json({ message: "Error al eliminar el rol", error });
    }
  };
}
