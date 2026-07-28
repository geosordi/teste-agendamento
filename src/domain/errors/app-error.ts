export interface ErrorBody {
  erro: string;
  mensagem: string;
}

export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly erro: string;

  constructor(mensagem: string) {
    super(mensagem);
    this.name = new.target.name;
  }

  public toBody(): ErrorBody {
    return { erro: this.erro, mensagem: this.message };
  }
}
