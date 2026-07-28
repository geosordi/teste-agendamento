import { APIGatewayProxyEvent } from 'aws-lambda';
import { registrarAgendamentoController } from '../container';
import { HttpResponse } from '../shared/http';
import { RegistrarAgendamentoResponse } from '../services/registrar-agendamento.service';

export const handler = (event: APIGatewayProxyEvent): Promise<HttpResponse<RegistrarAgendamentoResponse>> =>
  registrarAgendamentoController.criarAgendamento(event);
