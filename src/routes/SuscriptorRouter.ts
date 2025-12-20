import { Router } from "express";
import { SuscriptorController } from "@/controllers/SuscriptorController";
import { SuscriptorRepository } from "@/repositories/SuscriptorRepository";
import { SuscriptorServices } from "@/services/SuscriptorServices";
import { ISuscriptorRepository, ISuscriptorService } from "@/types/suscriptorType";

// Instanciación de dependencias para Suscriptor
const suscriptorRepository: ISuscriptorRepository = new SuscriptorRepository();
const suscriptorService: ISuscriptorService = new SuscriptorServices(suscriptorRepository);
const suscriptorController = new SuscriptorController(suscriptorService);

export default (router: Router) => {
  // Rutas para Suscriptor
  router.post('/suscriptor', suscriptorController.storeSuscriptor);
  router.get('/suscriptor', suscriptorController.indexListSuscriptor);
  router.get('/suscriptor/:id', suscriptorController.indexListSuscriptorById);
  router.put('/suscriptor/:id', suscriptorController.updateSuscriptorById);
}