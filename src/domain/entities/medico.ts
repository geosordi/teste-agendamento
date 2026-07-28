export type Horario = string;

export interface Medico {
  id: number;
  nome: string;
  especialidade: string;
  horarios_disponiveis: Horario[];
}
