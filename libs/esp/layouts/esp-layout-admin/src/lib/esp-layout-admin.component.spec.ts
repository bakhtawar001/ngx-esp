import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CosmosConfigService, COSMOS_CONFIG } from '@cosmos/core';
import { CosmosLayoutModule } from '@cosmos/layout';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { NavbarModule } from './components';
import { EspLayoutAdminComponent } from './esp-layout-admin.component';

describe('EspLayoutAdminComponent', () => {
  let component: EspLayoutAdminComponent;
  let spectator: Spectator<EspLayoutAdminComponent>;
  const createComponent = createComponentFactory({
    component: EspLayoutAdminComponent,
    imports: [
      CommonModule,
      CosmosLayoutModule.forRoot({}, []),
      NavbarModule,
      RouterTestingModule.withRoutes([]),
      NgxsModule.forRoot(),
      NoopAnimationsModule,
    ],
    providers: [
      CosmosConfigService,
      {
        provide: COSMOS_CONFIG,
        useValue: { layout: {} },
      },
    ],
    declarations: [EspLayoutAdminComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
