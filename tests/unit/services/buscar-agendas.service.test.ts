import { InMemoryMedicoRepository } from '../../../src/repositories/in-memory-medico-repository';
import { BuscarAgendasService } from '../../../src/services/buscar-agendas.service';

describe('BuscarAgendasService', () => {
  it('deve retornar a lista de medicos com seus horarios', () => {
    const repositorio = new InMemoryMedicoRepository();
    const service = new BuscarAgendasService(repositorio);

    const resultado = service.execute();

    expect(resultado.medicos).toHaveLength(2);
    expect(resultado.medicos[0].nome).toBe('Dr. Joao Silva');
    expect(resultado.medicos[0].horarios_disponiveis).toContain('2026-06-10 09:00');
  });
});
