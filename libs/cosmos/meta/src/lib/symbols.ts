import { InjectionToken } from '@angular/core';

export interface MetaSettings {
  applicationName: string;
  pageTitleSeparator: string;
  defaults: {
    title: string;
  };
}

export const META_SETTINGS = new InjectionToken<MetaSettings>('MetaSettings');
