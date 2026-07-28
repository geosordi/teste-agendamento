import { handler as buscarAgendasHandler } from '../../../src/handlers/buscar-agendas';
import { handler as registrarAgendamentoHandler } from '../../../src/handlers/registrar-agendamento';
import { makeEvent } from '../../helpers/make-event';

describe('Handlers Lambda', () => {
  it('GET /agendas deve retornar 200 com a lista de medicos', async () => {
    const resposta = await buscarAgendasHandler();

    expect(resposta.statusCode).toBe(200);
    expect(JSON.parse(resposta.body).medicos.length).toBeGreaterThan(0);
  });

  it('POST /agendamento deve retornar 201 para um payload valido', async () => {
    const evento = makeEvent({
      agendamento: { medico_id: 1, paciente: 'Paciente Handler', data_horario: '2026-06-10 11:00' },
    });

    const resposta = await registrarAgendamentoHandler(evento);

    expect(resposta.statusCode).toBe(201);
    expect(JSON.parse(resposta.body).agendamento.paciente).toBe('Paciente Handler');
  });
});
