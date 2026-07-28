import { randomUUID } from 'node:crypto';
import { Agendamento, AgendamentoRequest } from '../domain/entities/agendamento';
import { HorarioIndisponivelError } from '../domain/errors/horario-indisponivel-error';
import { MedicoNaoEncontradoError } from '../domain/errors/medico-nao-encontrado-error';
import { MedicoRepository } from '../repositories/medico-repository';

export interface RegistrarAgendamentoResponse {
  mensagem: string;
  agendamento: Agendamento;
}

export class RegistrarAgendamentoService {
  constructor(private readonly medicoRepository: MedicoRepository) {}

  public execute(dados: AgendamentoRequest): RegistrarAgendamentoResponse {
    const medico = this.medicoRepository.buscarPorId(dados.medico_id);
    if (!medico) {
      throw new MedicoNaoEncontradoError(`Medico com id ${dados.medico_id} nao encontrado.`);
    }

    const disponivel = this.medicoRepository.horarioEstaDisponivel(
      dados.medico_id,
      dados.data_horario,
    );
    if (!disponivel) {
      throw new HorarioIndisponivelError();
    }

    this.medicoRepository.ocuparHorario(dados.medico_id, dados.data_horario);

    const agendamento: Agendamento = {
      id: randomUUID(),
      medico: medico.nome,
      paciente: dados.paciente,
      data_horario: dados.data_horario,
    };

    return { mensagem: 'Agendamento realizado com sucesso', agendamento };
  }
}
