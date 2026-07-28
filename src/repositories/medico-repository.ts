import { Medico, Horario } from '../domain/entities/medico';

export interface MedicoRepository {
  listarTodos(): Medico[];

  buscarPorId(id: number): Medico | undefined;

  horarioEstaDisponivel(medicoId: number, dataHorario: Horario): boolean;

  ocuparHorario(medicoId: number, dataHorario: Horario): void;
}
