import { Router } from "express";
import { NumerosController } from "@/controllers/NumerosController";
import { NumerosRepository } from "@/repositories/NumerosRepository";
import { NumerosServices } from "@/services/NumerosServices";
import { INumerosRepository, INumerosService } from "@/types/numerosType";

// Instanciación de dependencias para Numeros
const numerosRepository: INumerosRepository = new NumerosRepository();
const numerosService: INumerosService = new NumerosServices(numerosRepository);
const numerosController = new NumerosController(numerosService);

export default (router: Router) => {
  // Rutas para Numeros
  router.post('/numeros', numerosController.storeNumeros);
  router.get('/numeros', numerosController.indexListNumeros);
  router.get('/numeros/:id', numerosController.indexListNumerosById);
  router.put('/numeros/:id', numerosController.updateNumerosById);
}