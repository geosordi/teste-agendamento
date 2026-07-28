import Anthropic from '@anthropic-ai/sdk';
import { TriagemResponse } from '../domain/entities/triagem';
import { LLMClient } from './triagem.service';

const SYSTEM_PROMPT = `Você é um assistente de triagem médica.
Com base nos sintomas descritos pelo paciente, indique a especialidade médica mais adequada.
Responda APENAS com um objeto JSON válido, sem blocos de código, sem texto adicional:
{
  "especialidade_sugerida": "<nome da especialidade>",
  "justificativa": "<explicação breve em até 2 frases>"
}`;

export class AnthropicLLMClient implements LLMClient {
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  public async sugerirEspecialidade(sintomas: string): Promise<TriagemResponse> {
    const message = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Sintomas do paciente: ${sintomas}` }],
    });

    const firstContent = message.content[0];
    if (firstContent.type !== 'text') {
      throw new Error('Resposta inesperada do modelo.');
    }

    const raw = firstContent.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(raw) as TriagemResponse;
  }
}
