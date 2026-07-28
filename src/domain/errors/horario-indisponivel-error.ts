import { AppError } from './app-error';

export class HorarioIndisponivelError extends AppError {
  public readonly statusCode = 409;
  public readonly erro = 'Horario indisponivel';

  constructor() {
    super('O horario solicitado nao esta mais disponivel para este medico.');
  }
}
