import { ModuleWithProviders } from '@angular/core';

export interface DevConfigOverrides {
  asiCentralDomain: string;
  stateLoggingFilter(action: any, type: string, state: any): boolean;
}

export const configOverrides: DevConfigOverrides = {
  asiCentralDomain: '',
  stateLoggingFilter(action, type, state) {
    return true; // true logs all, but could have something like the following:
    return type.includes('[SettingsState]'); // or `Load`, etc.
  },
};

export const importOverrides: ModuleWithProviders<unknown>[] = [];

/*
In order to override these settings for the local developer machine, add a
file called `dev-overrides.ts` in the `environments` folder (one up from this file).
After creating this file you will need to restart any running `serve` command.
Typescript's module resolution rules will prefer the `dev-overrides.ts` file
over this file (which uses folder name resolution with an `index.ts`).
The `dev-overrides.ts` file:
- should have the same exports as this file
- will be ignored by git, so it will not be comitted/stashed/staged
- could, for example, have the following contents:
```TS
import { ModuleWithProviders } from '@angular/core';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import {
  DevConfigOverrides,
  configOverrides as defaultOverrides,
} from './dev-overrides/index';

export { DevConfigOverrides };

export const configOverrides: DevConfigOverrides = {
  ...defaultOverrides,
  asiCentralDomain: `uat-asicentral.com`,
};

export const importOverrides: ModuleWithProviders<unknown>[] = [
  // overrides the import in CoreModule because this is imported last
  NgxsStoragePluginModule.forRoot({
    key: ['auth', 'someStateToStore'],
  }),
];
```
*/
