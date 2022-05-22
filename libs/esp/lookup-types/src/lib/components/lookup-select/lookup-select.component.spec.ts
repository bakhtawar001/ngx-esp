import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  EspLookupSelectComponent,
  EspLookupSelectComponentModule,
} from './lookup-select.component';

describe('EspLookupSelectComponent', () => {
  let spectator: Spectator<EspLookupSelectComponent>;
  let component: EspLookupSelectComponent;

  const createComponent = createComponentFactory({
    component: EspLookupSelectComponent,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot([]),
      EspLookupSelectComponentModule,
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
