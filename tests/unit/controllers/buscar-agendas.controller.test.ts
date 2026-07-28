import { BuscarAgendasController } from '../../../src/controllers/buscar-agendas.controller';
import { InMemoryMedicoRepository } from '../../../src/repositories/in-memory-medico-repository';
import { BuscarAgendasService } from '../../../src/services/buscar-agendas.service';

describe('BuscarAgendasController', () => {
  it('deve responder 200 com a lista de medicos', async () => {
    const repositorio = new InMemoryMedicoRepository();
    const controller = new BuscarAgendasController(new BuscarAgendasService(repositorio));

    const resposta = await controller.buscarAgendas();

    expect(resposta.statusCode).toBe(200);
    const corpo = JSON.parse(resposta.body);
    expect(corpo.medicos).toHaveLength(2);
  });
});
