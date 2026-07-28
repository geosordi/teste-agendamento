export interface AgendamentoRequest {
  medico_id: number;
  paciente: string;
  data_horario: string;
}

export interface Agendamento {
  id: string;
  medico: string;
  paciente: string;
  data_horario: string;
}
