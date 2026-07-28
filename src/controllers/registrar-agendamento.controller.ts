import { APIGatewayProxyEvent } from 'aws-lambda';
import { HandleHttpErrors } from '../decorators/handle-http-errors.decorator';
import { Log } from '../decorators/log.decorator';
import { ValidateBody } from '../decorators/validate-body.decorator';
import { AgendamentoRequest } from '../domain/entities/agendamento';
import {
  RegistrarAgendamentoResponse,
  RegistrarAgendamentoService,
} from '../services/registrar-agendamento.service';
import { validarAgendamentoRequest } from '../shared/validators/agendamento.validator';
import { HttpResponse, jsonResponse } from '../shared/http';

export class RegistrarAgendamentoController {
  constructor(private readonly service: RegistrarAgendamentoService) {}

  @HandleHttpErrors()
  @Log()
  @ValidateBody(validarAgendamentoRequest)
  public async criarAgendamento(
    _event: APIGatewayProxyEvent,
    dto?: AgendamentoRequest,
  ): Promise<HttpResponse<RegistrarAgendamentoResponse>> {
    const dados = dto as AgendamentoRequest;
    const resultado = this.service.execute(dados);
    return jsonResponse(201, resultado);
  }
}
