import { HandleHttpErrors } from '../decorators/handle-http-errors.decorator';
import { Log } from '../decorators/log.decorator';
import { BuscarAgendasResponse, BuscarAgendasService } from '../services/buscar-agendas.service';
import { HttpResponse, jsonResponse } from '../shared/http';

export class BuscarAgendasController {
  constructor(private readonly service: BuscarAgendasService) {}

  @HandleHttpErrors()
  @Log()
  public async buscarAgendas(): Promise<HttpResponse<BuscarAgendasResponse>> {
    const resultado = this.service.execute();
    return jsonResponse(200, resultado);
  }
}
