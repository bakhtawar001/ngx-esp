import { AnimationBuilder } from '@angular/animations';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { COSMOS_CONFIG } from '@cosmos/core';
import {
  CosmosLayoutModule,
  COSMOS_NAVIGATION,
  SidebarModule,
} from '@cosmos/layout';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { NavbarModule, ToolbarModule } from './components';
import { EspLayoutComponent } from './esp-layout.component';

describe('EspLayoutComponent', () => {
  let component: EspLayoutComponent;
  let spectator: Spectator<EspLayoutComponent>;
  const createComponent = createComponentFactory({
    component: EspLayoutComponent,
    imports: [
      CosmosLayoutModule,
      RouterModule.forRoot([]),
      NgxsModule.forRoot(),
      SidebarModule,

      NavbarModule,
      ToolbarModule,
    ],
    declarations: [EspLayoutComponent],
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
      AnimationBuilder,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
