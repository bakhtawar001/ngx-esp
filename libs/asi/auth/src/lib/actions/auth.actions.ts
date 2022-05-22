import { LoginRequest, LoginResponse } from '../types';

export namespace Auth {
  export class CheckSession {
    static type = '[Auth] CheckSession';
  }
  export class LoginWithCredentials {
    static type = '[Auth] LoginWithCredentials';
    constructor(
      public credentials: LoginRequest,
      public redirectUrl?: string
    ) {}
  }

  export class LoginSuccess {
    static type = '[Auth] LoginSuccess';

    constructor(public session: LoginResponse) {}
  }

  export class RefreshSessionSuccess {
    static type = '[Auth] RefreshSessionSuccess';

    constructor(public session: LoginResponse) {}
  }

  export class Logout {
    static type = '[Auth] Logout';
    constructor(public redirectUrl?: string) {}
  }
}
