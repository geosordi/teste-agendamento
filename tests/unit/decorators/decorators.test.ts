import { HandleHttpErrors } from '../../../src/decorators/handle-http-errors.decorator';
import { Log } from '../../../src/decorators/log.decorator';
import { ValidateBody } from '../../../src/decorators/validate-body.decorator';
import { AgendamentoRequest } from '../../../src/domain/entities/agendamento';
import { validarAgendamentoRequest } from '../../../src/shared/validators/agendamento.validator';
import { HttpResponse, jsonResponse } from '../../../src/shared/http';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { makeEvent, makeRawEvent } from '../../helpers/make-event';

class ControllerFake {
  @HandleHttpErrors()
  public async explode(): Promise<HttpResponse> {
    throw new Error('falha inesperada');
  }

  @HandleHttpErrors()
  @Log()
  @ValidateBody(validarAgendamentoRequest)
  public async echo(_event: APIGatewayProxyEvent, dto?: AgendamentoRequest): Promise<HttpResponse> {
    return jsonResponse(200, dto);
  }
}

describe('Decorators', () => {
  let fake: ControllerFake;

  beforeEach(() => {
    fake = new ControllerFake();
  });

  describe('@HandleHttpErrors', () => {
    it('deve converter um erro generico em resposta 500', async () => {
      const resposta = await fake.explode();
      expect(resposta.statusCode).toBe(500);
      expect(JSON.parse(resposta.body).erro).toBe('Erro interno');
    });
  });

  describe('@ValidateBody', () => {
    it('deve deixar passar um payload valido e injetar o DTO', async () => {
      const evento = makeEvent({
        agendamento: { medico_id: 1, paciente: 'Ana', data_horario: '2026-06-10 09:00' },
      });

      const resposta = await fake.echo(evento);

      expect(resposta.statusCode).toBe(200);
      expect(JSON.parse(resposta.body)).toEqual({
        medico_id: 1,
        paciente: 'Ana',
        data_horario: '2026-06-10 09:00',
      });
    });

    it('deve responder 400 quando o corpo nao e um JSON valido', async () => {
      const evento = makeRawEvent('{ isso nao e json }');

      const resposta = await fake.echo(evento);

      expect(resposta.statusCode).toBe(400);
    });

    it('deve responder 400 quando o corpo esta ausente', async () => {
      const evento = makeRawEvent(null);

      const resposta = await fake.echo(evento);

      expect(resposta.statusCode).toBe(400);
    });
  });

  describe('@Log', () => {
    it('deve logar o inicio e o fim da execucao', async () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

      const evento = makeEvent({
        agendamento: { medico_id: 1, paciente: 'Ana', data_horario: '2026-06-10 09:00' },
      });
      await fake.echo(evento);

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[inicio]'));
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[fim]'));

      spy.mockRestore();
    });
  });
});
