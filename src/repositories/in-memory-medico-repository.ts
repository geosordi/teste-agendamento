import { Medico, Horario } from '../domain/entities/medico';
import { MedicoRepository } from './medico-repository';

export class InMemoryMedicoRepository implements MedicoRepository {
  private readonly medicos: Medico[] = [
    {
      id: 1,
      nome: 'Dr. Joao Silva',
      especialidade: 'Cardiologista',
      horarios_disponiveis: ['2026-06-10 09:00', '2026-06-10 10:00', '2026-06-10 11:00'],
    },
    {
      id: 2,
      nome: 'Dra. Maria Souza',
      especialidade: 'Dermatologista',
      horarios_disponiveis: ['2026-06-11 14:00', '2026-06-11 15:00'],
    },
  ];

  public listarTodos(): Medico[] {
    return this.medicos;
  }

  public buscarPorId(id: number): Medico | undefined {
    return this.medicos.find((medico) => medico.id === id);
  }

  public horarioEstaDisponivel(medicoId: number, dataHorario: Horario): boolean {
    const medico = this.buscarPorId(medicoId);
    if (!medico) {
      return false;
    }
    return medico.horarios_disponiveis.includes(dataHorario);
  }

  public ocuparHorario(medicoId: number, dataHorario: Horario): void {
    const medico = this.buscarPorId(medicoId);
    if (!medico) {
      return;
    }
    medico.horarios_disponiveis = medico.horarios_disponiveis.filter(
      (horario) => horario !== dataHorario,
    );
  }
}
