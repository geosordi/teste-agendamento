import Joi from 'joi';
import { TriagemRequest } from '../../domain/entities/triagem';
import { ValidationError } from '../../domain/errors/validation-error';

const triagemSchema = Joi.object({
  sintomas: Joi.string().trim().min(1).required().messages({
    'any.required': 'O campo "sintomas" e obrigatorio.',
    'string.base': 'O campo "sintomas" deve ser um texto.',
    'string.empty': 'O campo "sintomas" nao pode ser vazio.',
  }),
})
  .unknown(false)
  .required();

export function validarTriagemRequest(body: unknown): TriagemRequest {
  const resultado = triagemSchema.validate(body, { abortEarly: false });

  if (resultado.error) {
    const mensagem = resultado.error.details.map((d) => d.message).join('; ');
    throw new ValidationError(mensagem);
  }

  return resultado.value as TriagemRequest;
}
