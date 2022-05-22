import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosBadgeDirective } from './badge.directive';

@Component({
  selector: 'cos-badge-component',
  template: ` <div cosBadge>Ad</div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosBadgeComponent {}

describe('CosBadgeDirective', () => {
  let component: CosBadgeComponent;
  let spectator: Spectator<CosBadgeComponent>;
  const createComponent = createComponentFactory({
    component: CosBadgeComponent,
    declarations: [CosBadgeDirective, CosBadgeComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should add classes', () => {
    expect(spectator.query('.cos-badge')).toBeTruthy();
  });
});
