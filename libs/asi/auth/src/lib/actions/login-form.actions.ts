import { LoginRequest } from '../types';

export namespace LoginForm {
  export class StoreUserLogin {
    static type = '[LoginForm] setValues';
    constructor(public credentials: LoginRequest) {}
  }

  export class ClearUserLogin {
    static type = '[LoginForm] ClearUserLogin';
  }
}
