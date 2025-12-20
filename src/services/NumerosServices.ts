import { INumerosRepository, INumerosService, Numeros } from "@/types/numerosType";

//logica de negocio
export class NumerosServices implements INumerosService {
  //inyeccion de dependencias
  private numerosRepository: INumerosRepository;

  // constructor
  constructor(numerosRepository: INumerosRepository) {
    this.numerosRepository = numerosRepository;
  }

  //metodos de la logica de negocio
  createNumeros(data: Numeros): Promise<Numeros> {
    return this.numerosRepository.create(data);
  }

  findNumeros(): Promise<Numeros[]> {
    return this.numerosRepository.find();
  }

  findByIdNumeros(id: string): Promise<Numeros | null> {
    return this.numerosRepository.findById(id);
  }

  updateNumeros(id: string, data: Numeros): Promise<Numeros | null> {
    return this.numerosRepository.update(id, data);
  }
}