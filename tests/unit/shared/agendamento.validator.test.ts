import { ValidationError } from '../../../src/domain/errors/validation-error';
import { validarAgendamentoRequest } from '../../../src/shared/validators/agendamento.validator';

describe('validarAgendamentoRequest', () => {
  it('deve aceitar um payload valido e devolver o DTO tipado', () => {
    const body = {
      agendamento: {
        medico_id: 1,
        paciente: 'Carlos Almeida',
        data_horario: '2026-06-10 09:00',
      },
    };

    const dto = validarAgendamentoRequest(body);

    expect(dto).toEqual({
      medico_id: 1,
      paciente: 'Carlos Almeida',
      data_horario: '2026-06-10 09:00',
    });
  });

  it('deve lancar ValidationError quando falta o objeto "agendamento"', () => {
    expect(() => validarAgendamentoRequest({})).toThrow(ValidationError);
  });

  it('deve lancar ValidationError quando medico_id nao e numero', () => {
    const body = {
      agendamento: { medico_id: 'x', paciente: 'Ana', data_horario: '2026-06-10 09:00' },
    };
    expect(() => validarAgendamentoRequest(body)).toThrow(ValidationError);
  });

  it('deve lancar ValidationError quando paciente e vazio', () => {
    const body = { agendamento: { medico_id: 1, paciente: '', data_horario: '2026-06-10 09:00' } };
    expect(() => validarAgendamentoRequest(body)).toThrow(ValidationError);
  });

  it('deve lancar ValidationError quando data_horario tem formato invalido', () => {
    const body = { agendamento: { medico_id: 1, paciente: 'Ana', data_horario: '10/06/2026' } };
    expect(() => validarAgendamentoRequest(body)).toThrow(ValidationError);
  });
});
