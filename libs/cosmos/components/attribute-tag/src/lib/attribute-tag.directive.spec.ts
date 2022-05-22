import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosAttributeTagModule } from './attribute-tag.module';

@Component({
  selector: 'cos-test-attribute-component',
  template: `
    <span cosAttributeTag>
      <i class="fa fa-{{ iconTag1 }}"></i> {{ innerTextTag1 }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestAttributeTagComponent {}

describe('CosAtrributeTagDirective', () => {
  let component: TestAttributeTagComponent;
  let spectator: Spectator<TestAttributeTagComponent>;
  const createComponent = createComponentFactory({
    component: TestAttributeTagComponent,
    imports: [CosAttributeTagModule],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
  it('Should render and add a class', () => {
    expect(spectator.query('.cos-attribute-tag')).toBeTruthy();
  });
});
