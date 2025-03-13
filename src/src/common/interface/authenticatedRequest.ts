import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any; // Idealmente, substitua `any` pelo tipo correto do payload do JWT
}
