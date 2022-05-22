import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator';
import {
  PresentationCardMenuComponent,
  PresentationCardMenuModule,
} from './presentation-card-menu.component';

describe('PresentationCardMenuComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationCardMenuComponent,
    imports: [PresentationCardMenuModule, RouterTestingModule],
  });

  it('should create', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });
});
