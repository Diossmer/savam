import { IUsuarioRepository, IUsuarioService, Usuarios } from "@/types/usuariosType";

//Servicio (Lógica de negocio)
export class UsuarioServices implements IUsuarioService {
  //inyeccion de dependencias
  private usuarioRepository: IUsuarioRepository;

  // constructor
  constructor(usuarioRepository: IUsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  //metodos de la logica de negocio
  createUsuario(data: Usuarios): Promise<Usuarios> {
    return this.usuarioRepository.create(data);
  }

  findUsuarios(): Promise<Usuarios[]> {
    return this.usuarioRepository.find();
  }

  findByIdUsuario(id: string): Promise<Usuarios | null> {
    return this.usuarioRepository.findById(id);
  }

  updateUsuario(id: string, data: Usuarios): Promise<Usuarios | null> {
    return this.usuarioRepository.update(id, data);
  }

  deleteUsuario(id: string): Promise<Usuarios | null> {
    return this.usuarioRepository.delete(id);
  }

}