import { LoginResponse } from './login-response';

export interface AuthSession extends LoginResponse {
  expires_at: number | null;
}
