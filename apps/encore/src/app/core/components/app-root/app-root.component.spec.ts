import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { COSMOS_CONFIG } from '@cosmos/core';
import { COSMOS_NAVIGATION } from '@cosmos/layout';
import '@cosmos/layout/resize-observer/mocks/resize-observer';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { AppRootComponent, AppRootComponentModule } from './app-root.component';

describe('AppRootComponent', () => {
  let spectator: Spectator<AppRootComponent>;
  const createComponent = createComponentFactory({
    component: AppRootComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: false,
        registrationStrategy: 'registerWhenStable:30000',
      }),

      NgxsModule.forRoot(),

      AppRootComponentModule,
    ],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
      {
        provide: COSMOS_CONFIG,
        useValue: {
          layout: {
            toolbar: {
              position: 'none',
            },
            navbar: {
              position: 'none',
            },
            footer: {
              position: 'none',
            },
          },
        },
      },
      {
        provide: COSMOS_NAVIGATION,
        useValue: {},
      },
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
