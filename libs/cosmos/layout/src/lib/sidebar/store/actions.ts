export class SetFolded {
  static readonly type = '[Sidebar] Set Folded';
  constructor(public key: string, public folded: boolean) {}
}
