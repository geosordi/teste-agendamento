import { TriagemError } from '../../../src/domain/errors/triagem-error';
import { LLMClient, TriagemService } from '../../../src/services/triagem.service';

const resposta = { especialidade_sugerida: 'Cardiologista', justificativa: 'Dor no peito.' };

const llmOk: LLMClient = { sugerirEspecialidade: jest.fn().mockResolvedValue(resposta) };
const llmFalha: LLMClient = {
  sugerirEspecialidade: jest.fn().mockRejectedValue(new Error('timeout')),
};

describe('TriagemService', () => {
  it('deve retornar a especialidade sugerida pelo LLM', async () => {
    const service = new TriagemService(llmOk);
    const resultado = await service.execute({ sintomas: 'dor no peito' });
    expect(resultado).toEqual(resposta);
  });

  it('deve lancar TriagemError (502) quando o LLM falha', async () => {
    const service = new TriagemService(llmFalha);
    await expect(service.execute({ sintomas: 'dor no peito' })).rejects.toThrow(TriagemError);
  });
});
