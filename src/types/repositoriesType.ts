//interface de la base de datos type generic
export interface Repository<T = unknown> {
  //2 metodos - metodo globales
  create(data: T): Promise<T>;
  find(): Promise<T[]>;
  //completando el crud
  findById(id: string): Promise<T | null>;
  update(id: string, data: T): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}