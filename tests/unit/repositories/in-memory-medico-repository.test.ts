import { InMemoryMedicoRepository } from '../../../src/repositories/in-memory-medico-repository';

describe('InMemoryMedicoRepository', () => {
  let repositorio: InMemoryMedicoRepository;

  beforeEach(() => {
    repositorio = new InMemoryMedicoRepository();
  });

  it('listarTodos deve retornar os medicos mockados', () => {
    expect(repositorio.listarTodos()).toHaveLength(2);
  });

  it('buscarPorId deve encontrar um medico existente', () => {
    expect(repositorio.buscarPorId(1)?.nome).toBe('Dr. Joao Silva');
  });

  it('buscarPorId deve retornar undefined para medico inexistente', () => {
    expect(repositorio.buscarPorId(999)).toBeUndefined();
  });

  it('horarioEstaDisponivel deve retornar false para medico inexistente', () => {
    expect(repositorio.horarioEstaDisponivel(999, '2026-06-10 09:00')).toBe(false);
  });

  it('horarioEstaDisponivel deve retornar false para horario fora da grade', () => {
    expect(repositorio.horarioEstaDisponivel(1, '2030-01-01 08:00')).toBe(false);
  });

  it('ocuparHorario nao deve lancar erro para medico inexistente', () => {
    expect(() => repositorio.ocuparHorario(999, '2026-06-10 09:00')).not.toThrow();
  });
});
