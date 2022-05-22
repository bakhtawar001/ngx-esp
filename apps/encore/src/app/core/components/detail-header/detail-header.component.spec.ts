import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  DetailHeaderComponent,
  DetailHeaderComponentModule,
} from './detail-header.component';

describe('DetailHeaderComponent', () => {
  let spectator: Spectator<DetailHeaderComponent>;
  let component: DetailHeaderComponent;

  const createComponent = createComponentFactory({
    component: DetailHeaderComponent,
    imports: [DetailHeaderComponentModule, RouterTestingModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    await spectator.fixture.whenStable();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
