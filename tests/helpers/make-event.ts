import { APIGatewayProxyEvent } from 'aws-lambda';

export function makeEvent(body?: unknown): APIGatewayProxyEvent {
  const evento = { body: body === undefined ? null : JSON.stringify(body) };
  return evento as unknown as APIGatewayProxyEvent;
}

export function makeRawEvent(rawBody: string | null): APIGatewayProxyEvent {
  return { body: rawBody } as unknown as APIGatewayProxyEvent;
}
