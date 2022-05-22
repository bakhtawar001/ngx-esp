import { InjectionToken } from '@angular/core';
import { CreateClientParams } from 'contentful';

export const SPONSORED_CONTENT_CONFIG = new InjectionToken<CreateClientParams>(
  'contentful sponsored content'
);
