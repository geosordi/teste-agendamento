import Joi from 'joi';
import { AgendamentoRequest } from '../../domain/entities/agendamento';
import { ValidationError } from '../../domain/errors/validation-error';

const agendamentoSchema = Joi.object({
  agendamento: Joi.object({
    medico_id: Joi.number().integer().required().messages({
      'any.required': 'O campo "medico_id" e obrigatorio.',
      'number.base': 'O campo "medico_id" deve ser um numero.',
      'number.integer': 'O campo "medico_id" deve ser um numero inteiro.',
    }),
    paciente: Joi.string().trim().min(1).required().messages({
      'any.required': 'O campo "paciente" e obrigatorio.',
      'string.base': 'O campo "paciente" deve ser um texto.',
      'string.empty': 'O campo "paciente" nao pode ser vazio.',
    }),
    data_horario: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
      .required()
      .messages({
        'any.required': 'O campo "data_horario" e obrigatorio.',
        'string.pattern.base': 'O campo "data_horario" deve estar no formato "YYYY-MM-DD HH:mm".',
      }),
  })
    .required()
    .messages({ 'any.required': 'O corpo deve conter o objeto "agendamento".' }),
})
  .unknown(false)
  .required();

export function validarAgendamentoRequest(body: unknown): AgendamentoRequest {
  const resultado = agendamentoSchema.validate(body, { abortEarly: false });

  if (resultado.error) {
    const mensagem = resultado.error.details.map((detalhe) => detalhe.message).join('; ');
    throw new ValidationError(mensagem);
  }

  return (resultado.value as { agendamento: AgendamentoRequest }).agendamento;
}
