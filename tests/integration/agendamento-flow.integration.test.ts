import { APIGatewayProxyEvent } from 'aws-lambda';
import { makeEvent } from '../helpers/make-event';

type BuscarAgendasFn = () => Promise<{ statusCode: number; body: string }>;
type RegistrarAgendamentoFn = (event: APIGatewayProxyEvent) => Promise<{
  statusCode: number;
  body: string;
}>;

describe('Integração: fluxo de agendamento', () => {
  let buscarAgendas: BuscarAgendasFn;
  let registrarAgendamento: RegistrarAgendamentoFn;

  beforeEach(() => {
    jest.resetModules();
    ({ handler: buscarAgendas } = require('../../src/handlers/buscar-agendas') as {
      handler: BuscarAgendasFn;
    });
    ({ handler: registrarAgendamento } = require('../../src/handlers/registrar-agendamento') as {
      handler: RegistrarAgendamentoFn;
    });
  });

  it('deve remover o horário da lista de disponíveis após um agendamento bem-sucedido', async () => {
    const antes = await buscarAgendas();
    const medicos = JSON.parse(antes.body).medicos;
    expect(medicos[0].horarios_disponiveis).toContain('2026-06-10 09:00');

    const booking = await registrarAgendamento(
      makeEvent({
        agendamento: { medico_id: 1, paciente: 'Ana Lima', data_horario: '2026-06-10 09:00' },
      }),
    );
    expect(booking.statusCode).toBe(201);

    const depois = await buscarAgendas();
    const medicosDepois = JSON.parse(depois.body).medicos;
    expect(medicosDepois[0].horarios_disponiveis).not.toContain('2026-06-10 09:00');
  });

  it('deve retornar 409 ao tentar agendar um horário já ocupado', async () => {
    const payload = {
      agendamento: { medico_id: 1, paciente: 'Carlos', data_horario: '2026-06-10 10:00' },
    };

    const primeiro = await registrarAgendamento(makeEvent(payload));
    expect(primeiro.statusCode).toBe(201);

    const segundo = await registrarAgendamento(makeEvent(payload));
    expect(segundo.statusCode).toBe(409);
    expect(JSON.parse(segundo.body)).toMatchObject({
      erro: 'Horario indisponivel',
    });
  });

  it('deve esvaziar a lista de horários disponíveis ao agendar todos os horários de um médico', async () => {
    const horarios = ['2026-06-10 09:00', '2026-06-10 10:00', '2026-06-10 11:00'];

    for (const horario of horarios) {
      const res = await registrarAgendamento(
        makeEvent({
          agendamento: { medico_id: 1, paciente: 'Paciente', data_horario: horario },
        }),
      );
      expect(res.statusCode).toBe(201);
    }

    const final = await buscarAgendas();
    const dr = JSON.parse(final.body).medicos.find((m: { id: number }) => m.id === 1);
    expect(dr.horarios_disponiveis).toHaveLength(0);
  });

  it('não deve afetar a agenda de outro médico ao realizar um agendamento', async () => {
    await registrarAgendamento(
      makeEvent({
        agendamento: { medico_id: 1, paciente: 'Fulano', data_horario: '2026-06-10 09:00' },
      }),
    );

    const agendas = await buscarAgendas();
    const dra = JSON.parse(agendas.body).medicos.find((m: { id: number }) => m.id === 2);
    expect(dra.horarios_disponiveis).toHaveLength(2);
  });

  it('não deve consumir nenhum horário ao receber um payload inválido', async () => {
    const antes = await buscarAgendas();
    const totalAntes = JSON.parse(antes.body).medicos[0].horarios_disponiveis.length;

    const bad = await registrarAgendamento(makeEvent({ agendamento: { medico_id: 1 } }));
    expect(bad.statusCode).toBe(400);

    const depois = await buscarAgendas();
    const totalDepois = JSON.parse(depois.body).medicos[0].horarios_disponiveis.length;
    expect(totalDepois).toBe(totalAntes);
  });

  it('deve retornar 201 com corpo completo e UUID válido em um agendamento bem-sucedido', async () => {
    const res = await registrarAgendamento(
      makeEvent({
        agendamento: {
          medico_id: 2,
          paciente: 'Maria Clara',
          data_horario: '2026-06-11 14:00',
        },
      }),
    );

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body).toMatchObject({
      mensagem: 'Agendamento realizado com sucesso',
      agendamento: {
        medico: 'Dra. Maria Souza',
        paciente: 'Maria Clara',
        data_horario: '2026-06-11 14:00',
      },
    });
    expect(body.agendamento.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});
