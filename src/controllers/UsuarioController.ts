import { IUsuarioService } from "@/types/usuariosType";
import { Request, Response } from "express";
import { logger } from "@/config/logger";

export class UsuarioController {
    private usuarioService: IUsuarioService

    constructor(usuarioService: IUsuarioService) {
        this.usuarioService = usuarioService;
    }

    storeUsuario = async (req: Request, res: Response): Promise<void> => {
        logger.sistema("[UsuarioController] [storeUsuario] - Iniciando creación de usuario");
        try {
            const { password, correo, nombre } = req.body;

            if (!password) {
                logger.error("Error al crear usuario - Contraseña no proporcionada");
                res.status(400).json({ message: "La contraseña es obligatoria para crear un usuario" });
                return;
            }

            const usuario = await this.usuarioService.createUsuario(req.body);

            logger.usuario(`Usuario creado exitosamente - ID: ${usuario.id}`, { roles: usuario.roles, correo: usuario.correo });
            res.status(201).json(usuario);
        } catch (error) {
            logger.error("Error al crear usuario", error);
            res.status(500).json({ message: "Error al crear usuario", error: error instanceof Error ? error.message : String(error) });
        }
    }

    indexListUsuario = async (req: Request, res: Response): Promise<void> => {
        logger.sistema("[UsuarioController] [indexListUsuario] - Obteniendo lista de usuarios");
        try {
            const usuarios = await this.usuarioService.findUsuarios();
            logger.sistema(`[UsuarioController] [indexListUsuario] - Usuarios recuperados: ${usuarios.length}`);
            res.status(200).json(usuarios);
        } catch (error) {
            logger.error("Error al obtener usuarios", error);
            res.status(500).json({ message: "Error al obtener usuarios", error: error instanceof Error ? error.message : String(error) });
        }
    }

    indexListUsuarioById = async (req: Request, res: Response): Promise<void> => {
        logger.sistema(`[UsuarioController] [indexListUsuarioById] - Buscando usuario ID: ${req.params.id}`);
        try {
            const usuario = await this.usuarioService.findByIdUsuario(req.params.id);
            if (!usuario) {
                logger.sistema(`[UsuarioController] [indexListUsuarioById] - Usuario no encontrado ID: ${req.params.id}`);
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            logger.sistema(`[UsuarioController] [indexListUsuarioById] - Usuario encontrado: ${usuario.nombre} ${usuario.apellido}`);
            res.status(200).json(usuario);
        } catch (error) {
            logger.error(`Error al obtener usuario ID ${req.params.id}`, error);
            res.status(500).json({ message: "Error al obtener usuario", error: error instanceof Error ? error.message : String(error) });
        }
    }

    updateUsuarioById = async (req: Request, res: Response): Promise<void> => {
        logger.sistema(`[UsuarioController] [updateUsuarioById] - Iniciando actualización de usuario ID: ${req.params.id}`);
        try {
            console.log(req.body)
            const usuario = await this.usuarioService.updateUsuario(req.params.id, req.body);
            console.log(usuario)
            if (!usuario) {
                logger.sistema(`[UsuarioController] [updateUsuarioById] - Usuario no encontrado para actualizar ID: ${req.params.id}`);
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            logger.usuario(`Usuario actualizado exitosamente - ID: ${usuario.id}`, { roles: usuario.roles });
            res.status(200).json(usuario);
        } catch (error) {
            logger.error(`Error al actualizar usuario ID ${req.params.id}`, error);
            res.status(500).json({ message: "Error al actualizar usuario", error: error instanceof Error ? error.message : String(error) });
        }
    }

    deleteUsuarioById = async (req: Request, res: Response): Promise<void> => {
        logger.sistema(`[UsuarioController] [deleteUsuarioById] - Iniciando eliminación de usuario ID: ${req.params.id}`);
        try {
            const usuario = await this.usuarioService.deleteUsuario(req.params.id);
            if (!usuario) {
                logger.sistema(`[UsuarioController] [deleteUsuarioById] - Usuario no encontrado para eliminar ID: ${req.params.id}`);
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            logger.usuario(`Usuario eliminado exitosamente - ID: ${usuario.id}`, { nombre: usuario.nombre, correo: usuario.correo });
            res.status(200).json({ message: "Usuario eliminado exitosamente", usuario });
        } catch (error) {
            logger.error(`Error al eliminar usuario ID ${req.params.id}`, error);
            res.status(500).json({ message: "Error al eliminar usuario", error: error instanceof Error ? error.message : String(error) });
        }
    }
}