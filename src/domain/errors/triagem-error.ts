import { AppError } from './app-error';

export class TriagemError extends AppError {
  public readonly statusCode = 502;
  public readonly erro = 'Erro no servico de triagem';
}
