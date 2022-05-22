export interface LoginRequest {
  asi_number?: string;
  username: string;
  password: string;
  rememberMe?: boolean;
  app_code?: string;
}
