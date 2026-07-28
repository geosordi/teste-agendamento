export interface TriagemRequest {
  sintomas: string;
}

export interface TriagemResponse {
  especialidade_sugerida: string;
  justificativa: string;
}
