import { HandleHttpErrors } from '../decorators/handle-http-errors.decorator';
import { Log } from '../decorators/log.decorator';
import { BuscarAgendasResponse, BuscarAgendasService } from '../services/buscar-agendas.service';
import { HttpResponse, jsonResponse } from '../shared/http';

export class BuscarAgendasController {
  constructor(private readonly service: BuscarAgendasService) {}

  // buscarMedicos: nome de dominio que deixa claro o que a rota faz
  // (busca os medicos e suas agendas). Nao recebe "event" porque nao precisa
  // de body nem de query string.
  //
  // Os DECORATORS sao aplicados de baixo para cima:
  //   @Log              -> mede/loga a execucao (mais interno)
  //   @HandleHttpErrors -> captura erros e devolve HTTP adequado (mais externo)
  //
  // O retorno e tipado como Promise<HttpResponse<BuscarAgendasResponse>>, deixando
  // explicito qual objeto vai serializado no corpo da resposta.
  @HandleHttpErrors()
  @Log()
  public async buscarMedicos(): Promise<HttpResponse<BuscarAgendasResponse>> {
    const resultado = this.service.execute();
    return jsonResponse(200, resultado); // Responde 200 com a lista de medicos
  }
}
