import { buscarAgendasController } from '../container';
import { HttpResponse } from '../shared/http';
import { BuscarAgendasResponse } from '../services/buscar-agendas.service';

export const handler = (): Promise<HttpResponse<BuscarAgendasResponse>> =>
  buscarAgendasController.buscarAgendas();
