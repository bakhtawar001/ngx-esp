import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosPillModule } from './pill.module';

@Component({
  selector: 'cos-test-pill-component',
  template: ` <a cosPill> Pill Text <i class="fa fa-plus"></i></a> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestPillComponent {}

@Component({
  selector: 'cos-pill-label-component',
  template: ` <span cosPillLabel>{{ innerText }} </span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestPillLabelComponent {}

describe('CosPillDirective', () => {
  let component: TestPillComponent;
  let spectator: Spectator<TestPillComponent>;
  const createComponent = createComponentFactory({
    component: TestPillComponent,
    imports: [CosPillModule],
    declarations: [TestPillComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should add classes', () => {
    expect(spectator.query('.cos-pill')).toBeTruthy();
  });
});

describe('CosPillLabelDirective', () => {
  let component: TestPillLabelComponent;
  let spectator: Spectator<TestPillLabelComponent>;
  const createComponent = createComponentFactory({
    component: TestPillLabelComponent,
    imports: [CosPillModule],
    declarations: [TestPillLabelComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should add classes', () => {
    expect(spectator.query('.cos-pill-label')).toBeTruthy();
  });
});
