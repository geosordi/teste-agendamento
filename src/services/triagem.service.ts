import { TriagemRequest, TriagemResponse } from '../domain/entities/triagem';
import { TriagemError } from '../domain/errors/triagem-error';

export interface LLMClient {
  sugerirEspecialidade(sintomas: string): Promise<TriagemResponse>;
}

export class TriagemService {
  constructor(private readonly llm: LLMClient) {}

  public async execute(dados: TriagemRequest): Promise<TriagemResponse> {
    try {
      return await this.llm.sugerirEspecialidade(dados.sintomas);
    } catch (err) {
      console.error('[TriagemService] Erro ao chamar LLM:', err);
      throw new TriagemError('Falha ao processar triagem. Tente novamente mais tarde.');
    }
  }
}
