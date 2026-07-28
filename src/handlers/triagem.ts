import { APIGatewayProxyEvent } from 'aws-lambda';
import { triagemController } from '../container';
import { HttpResponse } from '../shared/http';
import { TriagemResponse } from '../domain/entities/triagem';

export const handler = (event: APIGatewayProxyEvent): Promise<HttpResponse<TriagemResponse>> =>
  triagemController.triar(event);
