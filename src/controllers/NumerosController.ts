import { Request, Response } from "express";
import { INumerosService } from "@/types/numerosType";
import { logger } from "@/config/logger";

export class NumerosController {
  private numerosService: INumerosService;

  constructor(numerosService: INumerosService) {
    this.numerosService = numerosService;
  }

  // Crear un nuevo numero
  storeNumeros = async (req: Request, res: Response): Promise<void> => {
    logger.sistema("[NumerosController] [storeNumeros] - Iniciando creación de número");
    try {
      const nuevoRol = await this.numerosService.createNumeros(req.body);
      logger.usuario(`Número creado exitosamente - ID: ${nuevoRol.id}`, { telefono: nuevoRol.numero });
      res.status(201).json(nuevoRol);
    } catch (error) {
      logger.error("Error al crear el número", error);
      res.status(500).json({ message: "Error al crear el rol", error });
    }
  };

  // Obtener todos los Numeros
  indexListNumeros = async (req: Request, res: Response): Promise<void> => {
    logger.sistema("[NumerosController] [indexListNumeros] - Obteniendo lista de números");
    try {
      const Numeros = await this.numerosService.findNumeros();
      logger.sistema(`[NumerosController] [indexListNumeros] - Números recuperados: ${Numeros.length}`);
      res.status(200).json(Numeros);
    } catch (error) {
      logger.error("Error al obtener los números", error);
      res.status(500).json({ message: "Error al obtener los Numeros", error });
    }
  };

  // Obtener un numero por ID
  indexListNumerosById = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[NumerosController] [indexListNumerosById] - Buscando número ID: ${req.params.id}`);
    try {
      const rol = await this.numerosService.findByIdNumeros(req.params.id);
      if (!rol) {
        logger.sistema(`[NumerosController] [indexListNumerosById] - Número no encontrado ID: ${req.params.id}`);
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }
      logger.sistema(`[NumerosController] [indexListNumerosById] - Número encontrado: ${rol.numero}`);
      res.status(200).json(rol);
    } catch (error) {
      logger.error(`Error al obtener el número ID ${req.params.id}`, error);
      res.status(500).json({ message: "Error al obtener el rol", error });
    }
  };

  // Actualizar un numero por ID
  updateNumerosById = async (req: Request, res: Response): Promise<void> => {
    logger.sistema(`[NumerosController] [updateNumerosById] - Iniciando actualización de número ID: ${req.params.id}`);
    try {
      const rolActualizado = await this.numerosService.updateNumeros(
        req.params.id,
        req.body
      );
      if (!rolActualizado) {
        logger.sistema(`[NumerosController] [updateNumerosById] - Número no encontrado para actualizar ID: ${req.params.id}`);
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }
      logger.usuario(`Número actualizado exitosamente - ID: ${rolActualizado.id}`, { telefono: rolActualizado.numero });
      res.status(200).json(rolActualizado);
    } catch (error) {
      logger.error(`Error al actualizar el número ID ${req.params.id}`, error);
      res.status(500).json({ message: "Error al actualizar el rol", error });
    }
  };
}