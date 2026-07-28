import { BuscarAgendasController } from './controllers/buscar-agendas.controller';
import { RegistrarAgendamentoController } from './controllers/registrar-agendamento.controller';
import { TriagemController } from './controllers/triagem.controller';
import { InMemoryMedicoRepository } from './repositories/in-memory-medico-repository';
import { MedicoRepository } from './repositories/medico-repository';
import { AnthropicLLMClient } from './services/anthropic-llm-client';
import { BuscarAgendasService } from './services/buscar-agendas.service';
import { RegistrarAgendamentoService } from './services/registrar-agendamento.service';
import { TriagemService } from './services/triagem.service';

const medicoRepository: MedicoRepository = new InMemoryMedicoRepository();

export const buscarAgendasController = new BuscarAgendasController(
  new BuscarAgendasService(medicoRepository),
);

export const registrarAgendamentoController = new RegistrarAgendamentoController(
  new RegistrarAgendamentoService(medicoRepository),
);

export const triagemController = new TriagemController(
  new TriagemService(new AnthropicLLMClient()),
);
