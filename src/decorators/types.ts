import { HttpResponse } from '../shared/http';

export type ControllerMethod = (...args: unknown[]) => Promise<HttpResponse>;
