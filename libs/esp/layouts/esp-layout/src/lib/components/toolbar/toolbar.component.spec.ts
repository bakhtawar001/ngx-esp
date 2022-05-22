import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { COSMOS_CONFIG } from '@cosmos/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let spectator: Spectator<ToolbarComponent>;
  const createComponent = createComponentFactory({
    component: ToolbarComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,

      ToolbarModule,

      NgxsModule.forRoot(),
    ],
    providers: [
      { provide: APP_BASE_HREF, useValue: '' },
      {
        provide: COSMOS_CONFIG,
        useValue: {
          layout: {},
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
  it('works', () => {
    expect(component).toBeTruthy();
  });
});
