const _scope = 'UserProfile';

export namespace UserProfileActions {
  export class UpdateFullName {
    static type = `[${_scope}] UpdateName`;
    constructor(public payload: { GivenName: string; FamilyName: string }) {}
  }

  export class UpdateUserName {
    static type = `[${_scope}] UpdateUserName`;
    constructor(public name: string) {}
  }

  export class UpdateLoginEmail {
    static type = `[${_scope}] UpdateLoginEmail`;
    constructor(public email: string) {}
  }
}
