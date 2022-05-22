interface UserInfo {
  AsiNumber: string;
  NeedConsent: boolean;
  PasswordResetRequired: boolean;
}

export interface LoginResponse {
  AccessToken?: string;
  ExpiresIn?: string;
  RefreshToken?: string;
  TokenType?: string;
  UserInfo: UserInfo;
}
