import { Router } from "express";
import { UsuarioController } from "@/controllers/UsuarioController";
import { UsuariosRepository } from "@/repositories/UsuariosRepository";
import { UsuarioServices } from "@/services/UsuarioServices";
import { IUsuarioRepository, IUsuarioService } from "@/types/usuariosType";

// Instanciación de dependencias para Usuarios
const usuarioRepository: IUsuarioRepository = new UsuariosRepository();
const usuarioService: IUsuarioService = new UsuarioServices(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

export default (router: Router) => {
  // Rutas para Usuarios
  router.post('/usuarios', usuarioController.storeUsuario);
  router.get('/usuarios', usuarioController.indexListUsuario);
  router.get('/usuarios/:id', usuarioController.indexListUsuarioById);
  router.put('/usuarios/:id', usuarioController.updateUsuarioById);
  router.delete('/usuarios/:id', usuarioController.deleteUsuarioById);
};