import { RegistrarAgendamentoController } from '../../../src/controllers/registrar-agendamento.controller';
import { InMemoryMedicoRepository } from '../../../src/repositories/in-memory-medico-repository';
import { RegistrarAgendamentoService } from '../../../src/services/registrar-agendamento.service';
import { makeEvent } from '../../helpers/make-event';

describe('RegistrarAgendamentoController', () => {
  let controller: RegistrarAgendamentoController;

  beforeEach(() => {
    const repositorio = new InMemoryMedicoRepository();
    controller = new RegistrarAgendamentoController(new RegistrarAgendamentoService(repositorio));
  });

  it('deve responder 201 quando o agendamento e valido', async () => {
    const evento = makeEvent({
      agendamento: { medico_id: 1, paciente: 'Carlos', data_horario: '2026-06-10 09:00' },
    });

    const resposta = await controller.criarAgendamento(evento);

    expect(resposta.statusCode).toBe(201);
    const corpo = JSON.parse(resposta.body);
    expect(corpo.mensagem).toBe('Agendamento realizado com sucesso');
    expect(corpo.agendamento.medico).toBe('Dr. Joao Silva');
  });

  it('deve responder 400 quando o payload e invalido', async () => {
    const evento = makeEvent({ agendamento: { paciente: '' } });

    const resposta = await controller.criarAgendamento(evento);

    expect(resposta.statusCode).toBe(400);
    expect(JSON.parse(resposta.body).erro).toBe('Payload invalido');
  });

  it('deve responder 404 quando o medico nao existe', async () => {
    const evento = makeEvent({
      agendamento: { medico_id: 999, paciente: 'Ze', data_horario: '2026-06-10 09:00' },
    });

    const resposta = await controller.criarAgendamento(evento);

    expect(resposta.statusCode).toBe(404);
    expect(JSON.parse(resposta.body).erro).toBe('Medico nao encontrado');
  });

  it('deve responder 409 quando o horario ja esta ocupado', async () => {
    const payload = {
      agendamento: { medico_id: 1, paciente: 'Carlos', data_horario: '2026-06-10 09:00' },
    };

    await controller.criarAgendamento(makeEvent(payload));
    const resposta = await controller.criarAgendamento(makeEvent(payload));

    expect(resposta.statusCode).toBe(409);
    expect(JSON.parse(resposta.body).erro).toBe('Horario indisponivel');
  });
});
