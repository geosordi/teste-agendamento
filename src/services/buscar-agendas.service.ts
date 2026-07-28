import { Medico } from '../domain/entities/medico';
import { MedicoRepository } from '../repositories/medico-repository';

export interface BuscarAgendasResponse {
  medicos: Medico[];
}

export class BuscarAgendasService {
  constructor(private readonly medicoRepository: MedicoRepository) {}

  public execute(): BuscarAgendasResponse {
    const medicos = this.medicoRepository.listarTodos();
    return { medicos };
  }
}
