import { HttpResponse } from '../shared/http';
import { ControllerMethod } from './types';

export function Log() {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const metodoOriginal = descriptor.value as ControllerMethod;
    const nomeMetodo = String(propertyKey);

    descriptor.value = async function (this: unknown, ...args: unknown[]): Promise<HttpResponse> {
      console.log(`[inicio] ${nomeMetodo}`);
      const inicio = Date.now();

      const resultado = (await metodoOriginal.apply(this, args)) as HttpResponse;

      const duracao = Date.now() - inicio;
      console.log(`[fim] ${nomeMetodo} (${duracao}ms) -> status ${resultado.statusCode}`);
      return resultado;
    };

    return descriptor;
  };
}
