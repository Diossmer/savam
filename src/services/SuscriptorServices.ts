import { ISuscriptorRepository, ISuscriptorService, Suscriptor } from "@/types/suscriptorType";

//logica de negocio
export class SuscriptorServices implements ISuscriptorService {
  //inyeccion de dependencias
  private suscriptorRepository: ISuscriptorRepository;

  // constructor
  constructor(suscriptorRepository: ISuscriptorRepository) {
    this.suscriptorRepository = suscriptorRepository;
  }

  //metodos de la logica de negocio
  createSuscriptor(data: Suscriptor): Promise<Suscriptor> {
    return this.suscriptorRepository.create(data);
  }

  findSuscriptor(): Promise<Suscriptor[]> {
    return this.suscriptorRepository.find();
  }

  findByIdSuscriptor(id: string): Promise<Suscriptor | null> {
    return this.suscriptorRepository.findById(id);
  }

  updateSuscriptor(id: string, data: Suscriptor): Promise<Suscriptor | null> {
    return this.suscriptorRepository.update(id, data);
  }
}