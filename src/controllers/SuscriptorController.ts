import { Request, Response } from "express";
import { ISuscriptorService } from "@/types/suscriptorType";
import { logger } from "@/config/logger";

export class SuscriptorController {
  private suscriptorService: ISuscriptorService;

  constructor(suscriptorService: ISuscriptorService) {
    this.suscriptorService = suscriptorService;
  }

  // Crear un nuevo suscriptor
  storeSuscriptor = async (req: Request, res: Response): Promise<void> => {
    logger.sistema("[SuscriptorController] [storeSuscriptor] - Iniciando creación de suscriptor");
    try {
      const nuevoSuscriptor = await this.suscriptorService.createSuscriptor(req.body);
      logger.usuario(`Suscriptor creado exitosamente - ID: ${nuevoSuscriptor.id}`, { cedula: nuevoSuscriptor.cedula });
      res.status(201).json(nuevoSuscriptor);
    } catch (error) {
      logger.error("Error al crear el suscriptor", error);
      res.status(500).json({ message: "Error al crear el suscriptor", error });
    }
  };

  // Obtener todos los suscriptores
  indexListSuscriptor = async (req: Request, res: Response): Promise<void> => {
    logger.sistema("[SuscriptorController] [indexListSuscriptor] - Obteniendo lista de suscriptores");
    try {
      const suscriptor = await this.suscriptorService.findSuscriptor();
      logger.sistema(`[SuscriptorController] [indexListSuscriptor] - Suscriptores recuperados: ${suscriptor.length}`);
      res.status(200).json(suscriptor);
    } catch (error) {
      logger.error("Error al obtener los suscriptores", error);
      res.status(500).json({ message: "Error al obtener los suscriptor", error });
    }
  };

  // Obtener un suscriptor por ID
  indexListSuscriptorById = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[SuscriptorController] [indexListSuscriptorById] - Buscando suscriptor ID: ${req.params.id}`);
    try {
      const suscriptor = await this.suscriptorService.findByIdSuscriptor(req.params.id);
      if (!suscriptor) {
        logger.sistema(`[SuscriptorController] [indexListSuscriptorById] - Suscriptor no encontrado ID: ${req.params.id}`);
        res.status(404).json({ message: "Suscriptor no encontrado" });
        return;
      }
      logger.sistema(`[SuscriptorController] [indexListSuscriptorById] - Suscriptor encontrado: ${suscriptor.cedula}`);
      res.status(200).json(suscriptor);
    } catch (error) {
      logger.error(`Error al obtener el suscriptor ID ${req.params.id}`, error);
      res.status(500).json({ message: "Error al obtener el suscriptor", error });
    }
  };

  // Actualizar un suscriptor por ID
  updateSuscriptorById = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[SuscriptorController] [updateSuscriptorById] - Iniciando actualización de suscriptor ID: ${req.params.id}`);
    try {
      const suscriptorActualizado = await this.suscriptorService.updateSuscriptor(
        req.params.id,
        req.body
      );
      if (!suscriptorActualizado) {
        logger.sistema(`[SuscriptorController] [updateSuscriptorById] - Suscriptor no encontrado para actualizar ID: ${req.params.id}`);
        res.status(404).json({ message: "Suscriptor no encontrado" });
        return;
      }
      logger.usuario(`Suscriptor actualizado exitosamente - ID: ${suscriptorActualizado.id}`, { cedula: suscriptorActualizado.cedula });
      res.status(200).json(suscriptorActualizado);
    } catch (error) {
      logger.error(`Error al actualizar el suscriptor ID ${req.params.id}`, error);
      res.status(500).json({ message: "Error al actualizar el suscriptor", error });
    }
  };
}