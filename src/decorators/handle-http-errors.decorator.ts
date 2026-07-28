import { AppError } from '../domain/errors/app-error';
import { HttpResponse, jsonResponse } from '../shared/http';
import { ControllerMethod } from './types';

export function HandleHttpErrors() {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const metodoOriginal = descriptor.value as ControllerMethod;

    descriptor.value = async function (this: unknown, ...args: unknown[]): Promise<HttpResponse> {
      try {
        return await metodoOriginal.apply(this, args);
      } catch (erro) {
        if (erro instanceof AppError) {
          return jsonResponse(erro.statusCode, erro.toBody());
        }
        console.error('Erro inesperado:', erro);
        return jsonResponse(500, {
          erro: 'Erro interno',
          mensagem: 'Ocorreu um erro inesperado ao processar a requisicao.',
        });
      }
    };

    return descriptor;
  };
}
