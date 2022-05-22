import { DesignSettingCode } from '../models';

export namespace DesignSettingsActions {
  export class Load {
    static type = '[DesignSettings] Load';
  }

  export class UpdateSetting {
    static type = '[DesignSettings] Update Setting';

    constructor(public key: DesignSettingCode, public value: Record<string, unknown>) {}
  }
}
