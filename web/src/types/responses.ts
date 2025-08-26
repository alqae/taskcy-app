import type { User } from './models'

export class ApiErrorResponse {
  message: string = '';

  constructor(init?: Partial<ApiErrorResponse>) {
    Object.assign(this, init);
  }
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
