import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { TrackingPage, TrackingPageModule } from './tracking.page';

describe('TrackingPage', () => {
  let spectator: Spectator<TrackingPage>;
  let component: TrackingPage;

  const createComponent = createComponentFactory({
    component: TrackingPage,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      TrackingPageModule,
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
