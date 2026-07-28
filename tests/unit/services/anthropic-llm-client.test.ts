import { AnthropicLLMClient } from '../../../src/services/anthropic-llm-client';

const mockCreate = jest.fn();

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

describe('AnthropicLLMClient', () => {
  beforeEach(() => mockCreate.mockReset());

  it('deve retornar a especialidade parseada do JSON da resposta', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({ especialidade_sugerida: 'Cardiologista', justificativa: 'ok' }),
        },
      ],
    });

    const client = new AnthropicLLMClient();
    const resultado = await client.sugerirEspecialidade('dor no peito');

    expect(resultado.especialidade_sugerida).toBe('Cardiologista');
    expect(resultado.justificativa).toBe('ok');
  });

  it('deve remover blocos de codigo markdown antes de parsear o JSON', async () => {
    const json = JSON.stringify({ especialidade_sugerida: 'Neurologista', justificativa: 'ok' });
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '```json\n' + json + '\n```' }],
    });

    const client = new AnthropicLLMClient();
    const resultado = await client.sugerirEspecialidade('dor de cabeca');

    expect(resultado.especialidade_sugerida).toBe('Neurologista');
  });

  it('deve lancar erro quando o tipo do conteudo nao e texto', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: '' } }],
    });

    const client = new AnthropicLLMClient();
    await expect(client.sugerirEspecialidade('febre')).rejects.toThrow(
      'Resposta inesperada do modelo.',
    );
  });

  it('deve lancar erro quando a API falha', async () => {
    mockCreate.mockRejectedValue(new Error('Network error'));

    const client = new AnthropicLLMClient();
    await expect(client.sugerirEspecialidade('febre')).rejects.toThrow('Network error');
  });
});
