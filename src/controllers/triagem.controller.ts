import { APIGatewayProxyEvent } from 'aws-lambda';
import { HandleHttpErrors } from '../decorators/handle-http-errors.decorator';
import { Log } from '../decorators/log.decorator';
import { ValidateBody } from '../decorators/validate-body.decorator';
import { TriagemRequest, TriagemResponse } from '../domain/entities/triagem';
import { TriagemService } from '../services/triagem.service';
import { HttpResponse, jsonResponse } from '../shared/http';
import { validarTriagemRequest } from '../shared/validators/triagem.validator';

export class TriagemController {
  constructor(private readonly service: TriagemService) {}

  @HandleHttpErrors()
  @Log()
  @ValidateBody(validarTriagemRequest)
  public async triar(
    _event: APIGatewayProxyEvent,
    dto?: TriagemRequest,
  ): Promise<HttpResponse<TriagemResponse>> {
    const dados = dto as TriagemRequest;
    const resultado = await this.service.execute(dados);
    return jsonResponse(200, resultado);
  }
}
