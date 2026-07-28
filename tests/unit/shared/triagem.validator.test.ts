import { validarTriagemRequest } from '../../../src/shared/validators/triagem.validator';
import { ValidationError } from '../../../src/domain/errors/validation-error';

describe('validarTriagemRequest', () => {
  it('deve retornar o DTO quando o payload e valido', () => {
    const resultado = validarTriagemRequest({ sintomas: 'dor de cabeca' });
    expect(resultado).toEqual({ sintomas: 'dor de cabeca' });
  });

  it('deve lancar ValidationError quando sintomas esta ausente', () => {
    expect(() => validarTriagemRequest({})).toThrow(ValidationError);
  });

  it('deve lancar ValidationError quando sintomas e uma string vazia', () => {
    expect(() => validarTriagemRequest({ sintomas: '' })).toThrow(ValidationError);
  });

  it('deve lancar ValidationError quando o corpo e nulo', () => {
    expect(() => validarTriagemRequest(null)).toThrow(ValidationError);
  });

  it('deve lancar ValidationError quando ha campos desconhecidos', () => {
    expect(() => validarTriagemRequest({ sintomas: 'febre', campo_extra: true })).toThrow(
      ValidationError,
    );
  });
});
