import { BuscarAgendasController } from './controllers/buscar-agendas.controller';
import { InMemoryMedicoRepository } from './repositories/in-memory-medico-repository';
import { MedicoRepository } from './repositories/medico-repository';
import { BuscarAgendasService } from './services/buscar-agendas.service';

const medicoRepository: MedicoRepository = new InMemoryMedicoRepository();

export const buscarAgendasController = new BuscarAgendasController(
  new BuscarAgendasService(medicoRepository),
);
