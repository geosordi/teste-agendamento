import { AgendamentoRequest } from '../../../src/domain/entities/agendamento';
import { HorarioIndisponivelError } from '../../../src/domain/errors/horario-indisponivel-error';
import { MedicoNaoEncontradoError } from '../../../src/domain/errors/medico-nao-encontrado-error';
import { InMemoryMedicoRepository } from '../../../src/repositories/in-memory-medico-repository';
import { RegistrarAgendamentoService } from '../../../src/services/registrar-agendamento.service';

describe('RegistrarAgendamentoService', () => {
  let repositorio: InMemoryMedicoRepository;
  let service: RegistrarAgendamentoService;

  beforeEach(() => {
    repositorio = new InMemoryMedicoRepository();
    service = new RegistrarAgendamentoService(repositorio);
  });

  it('deve registrar um agendamento valido com sucesso', () => {
    const dados: AgendamentoRequest = {
      medico_id: 1,
      paciente: 'Carlos Almeida',
      data_horario: '2026-06-10 09:00',
    };

    const resultado = service.execute(dados);

    expect(resultado.mensagem).toBe('Agendamento realizado com sucesso');
    expect(resultado.agendamento.medico).toBe('Dr. Joao Silva');
    expect(resultado.agendamento.paciente).toBe('Carlos Almeida');
    expect(resultado.agendamento.data_horario).toBe('2026-06-10 09:00');
    expect(typeof resultado.agendamento.id).toBe('string');
    expect(resultado.agendamento.id.length).toBeGreaterThan(0);
  });

  it('deve remover o horario da lista apos o agendamento', () => {
    service.execute({ medico_id: 1, paciente: 'Ana', data_horario: '2026-06-10 09:00' });

    expect(repositorio.horarioEstaDisponivel(1, '2026-06-10 09:00')).toBe(false);
  });

  it('deve lancar HorarioIndisponivelError (409) para horario ja ocupado', () => {
    service.execute({ medico_id: 1, paciente: 'Ana', data_horario: '2026-06-10 09:00' });

    expect(() =>
      service.execute({ medico_id: 1, paciente: 'Bruno', data_horario: '2026-06-10 09:00' }),
    ).toThrow(HorarioIndisponivelError);
  });

  it('deve lancar HorarioIndisponivelError (409) para horario inexistente na agenda', () => {
    expect(() =>
      service.execute({ medico_id: 1, paciente: 'Bruno', data_horario: '2030-01-01 08:00' }),
    ).toThrow(HorarioIndisponivelError);
  });

  it('deve lancar MedicoNaoEncontradoError (404) para medico inexistente', () => {
    expect(() =>
      service.execute({ medico_id: 999, paciente: 'Bruno', data_horario: '2026-06-10 09:00' }),
    ).toThrow(MedicoNaoEncontradoError);
  });
});
