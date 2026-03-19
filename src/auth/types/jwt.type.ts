import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
}

export interface JwtUser {
  id: number;
  email: string;
  roles: string[];
}

export interface JwtRequest extends Request {
  user: JwtUser;
}
