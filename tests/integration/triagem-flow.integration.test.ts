import { APIGatewayProxyEvent } from 'aws-lambda';
import { makeEvent } from '../helpers/make-event';

type TriagemFn = (event: APIGatewayProxyEvent) => Promise<{ statusCode: number; body: string }>;

const respostaLLMMock = {
  especialidade_sugerida: 'Cardiologista',
  justificativa: 'Sintomas relacionados ao coração.',
};

describe('Integração: fluxo de triagem', () => {
  let triagem: TriagemFn;

  beforeEach(() => {
    jest.resetModules();

    jest.mock('@anthropic-ai/sdk', () => ({
      __esModule: true,
      default: jest.fn().mockImplementation(() => ({
        messages: {
          create: jest.fn().mockResolvedValue({
            content: [{ type: 'text', text: JSON.stringify(respostaLLMMock) }],
          }),
        },
      })),
    }));

    ({ handler: triagem } = require('../../src/handlers/triagem') as { handler: TriagemFn });
  });

  it('deve retornar 200 com especialidade e justificativa para sintomas validos', async () => {
    const resposta = await triagem(makeEvent({ sintomas: 'dor no peito e falta de ar' }));

    expect(resposta.statusCode).toBe(200);
    const corpo = JSON.parse(resposta.body);
    expect(corpo.especialidade_sugerida).toBe('Cardiologista');
    expect(corpo.justificativa).toBe('Sintomas relacionados ao coração.');
  });

  it('deve retornar 400 para payload invalido (sem sintomas)', async () => {
    const resposta = await triagem(makeEvent({}));

    expect(resposta.statusCode).toBe(400);
    expect(JSON.parse(resposta.body).erro).toBe('Payload invalido');
  });

  it('deve retornar 502 quando o LLM retorna um erro', async () => {
    jest.resetModules();
    jest.mock('@anthropic-ai/sdk', () => ({
      __esModule: true,
      default: jest.fn().mockImplementation(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(new Error('API key invalid')),
        },
      })),
    }));

    ({ handler: triagem } = require('../../src/handlers/triagem') as { handler: TriagemFn });

    const resposta = await triagem(makeEvent({ sintomas: 'febre alta' }));

    expect(resposta.statusCode).toBe(502);
    expect(JSON.parse(resposta.body).erro).toBe('Erro no servico de triagem');
  });
});
