export namespace SettingsActions {
  export class LoadSettings {
    static type = '[SettingsState] Load Settings';
  }

  export class UpdateSetting {
    static type = '[SettingsState] Update Setting';
    constructor(
      public key: string,
      public values: Record<string, unknown>,
      public group?: string
    ) {}
  }
}
