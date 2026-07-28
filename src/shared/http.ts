import { APIGatewayProxyResult } from 'aws-lambda';

export type HttpResponse<TBody = unknown> = APIGatewayProxyResult & {
  readonly __body?: TBody;
};

export function jsonResponse<TBody>(statusCode: number, body: TBody): HttpResponse<TBody> {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
