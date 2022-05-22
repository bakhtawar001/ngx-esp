import { RouterTestingModule } from '@angular/router/testing';
import { CosmosConfigService, COSMOS_CONFIG } from '@cosmos/core';
import { COSMOS_NAVIGATION } from '@cosmos/layout';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EncoreLayoutComponent } from './encore-layout.component';

describe('EncoreLayoutComponent', () => {
  let component: EncoreLayoutComponent;
  let spectator: Spectator<EncoreLayoutComponent>;
  const createComponent = createComponentFactory({
    component: EncoreLayoutComponent,
    imports: [RouterTestingModule],
    declarations: [EncoreLayoutComponent],
    providers: [
      CosmosConfigService,
      {
        provide: COSMOS_CONFIG,
        useValue: { layout: {} },
      },
      {
        provide: COSMOS_NAVIGATION,
        useValue: {},
      },
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
