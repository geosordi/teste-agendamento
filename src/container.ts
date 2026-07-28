import { BuscarAgendasController } from './controllers/buscar-agendas.controller';
import { RegistrarAgendamentoController } from './controllers/registrar-agendamento.controller';
import { InMemoryMedicoRepository } from './repositories/in-memory-medico-repository';
import { MedicoRepository } from './repositories/medico-repository';
import { BuscarAgendasService } from './services/buscar-agendas.service';
import { RegistrarAgendamentoService } from './services/registrar-agendamento.service';

const medicoRepository: MedicoRepository = new InMemoryMedicoRepository();

export const buscarAgendasController = new BuscarAgendasController(
  new BuscarAgendasService(medicoRepository),
);

export const registrarAgendamentoController = new RegistrarAgendamentoController(
  new RegistrarAgendamentoService(medicoRepository),
);
