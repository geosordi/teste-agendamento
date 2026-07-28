import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '../domain/errors/validation-error';
import { HttpResponse } from '../shared/http';
import { ControllerMethod } from './types';

export function ValidateBody<T>(validador: (body: unknown) => T) {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const metodoOriginal = descriptor.value as ControllerMethod;

    descriptor.value = async function (this: unknown, ...args: unknown[]): Promise<HttpResponse> {
      const event = args[0] as APIGatewayProxyEvent;

      let corpo: unknown;
      try {
        corpo = event.body ? JSON.parse(event.body) : undefined;
      } catch {
        throw new ValidationError('O corpo da requisicao nao e um JSON valido.');
      }

      const dtoValidado = validador(corpo);

      return metodoOriginal.apply(this, [event, dtoValidado]);
    };

    return descriptor;
  };
}
