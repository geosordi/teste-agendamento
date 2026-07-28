import { AppError } from './app-error';

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly erro = 'Payload invalido';
}
