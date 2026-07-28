import { AppError } from './app-error';

export class MedicoNaoEncontradoError extends AppError {
  public readonly statusCode = 404;
  public readonly erro = 'Medico nao encontrado';
}
