import { TriagemController } from '../../../src/controllers/triagem.controller';
import { LLMClient, TriagemService } from '../../../src/services/triagem.service';
import { makeEvent } from '../../helpers/make-event';

const respostaLLM = { especialidade_sugerida: 'Neurologista', justificativa: 'Dor de cabeca.' };

function makeController(llm: LLMClient): TriagemController {
  return new TriagemController(new TriagemService(llm));
}

describe('TriagemController', () => {
  it('deve responder 200 com especialidade sugerida para payload valido', async () => {
    const llm: LLMClient = { sugerirEspecialidade: jest.fn().mockResolvedValue(respostaLLM) };
    const controller = makeController(llm);

    const resposta = await controller.triar(makeEvent({ sintomas: 'dor de cabeca intensa' }));

    expect(resposta.statusCode).toBe(200);
    const corpo = JSON.parse(resposta.body);
    expect(corpo.especialidade_sugerida).toBe('Neurologista');
    expect(corpo.justificativa).toBe('Dor de cabeca.');
  });

  it('deve responder 400 quando o payload e invalido', async () => {
    const llm: LLMClient = { sugerirEspecialidade: jest.fn() };
    const controller = makeController(llm);

    const resposta = await controller.triar(makeEvent({}));

    expect(resposta.statusCode).toBe(400);
    expect(JSON.parse(resposta.body).erro).toBe('Payload invalido');
  });

  it('deve responder 400 quando o corpo esta ausente', async () => {
    const llm: LLMClient = { sugerirEspecialidade: jest.fn() };
    const controller = makeController(llm);

    const resposta = await controller.triar(makeEvent());

    expect(resposta.statusCode).toBe(400);
  });

  it('deve responder 502 quando o LLM falha', async () => {
    const llm: LLMClient = {
      sugerirEspecialidade: jest.fn().mockRejectedValue(new Error('timeout')),
    };
    const controller = makeController(llm);

    const resposta = await controller.triar(makeEvent({ sintomas: 'febre' }));

    expect(resposta.statusCode).toBe(502);
    expect(JSON.parse(resposta.body).erro).toBe('Erro no servico de triagem');
  });
});
