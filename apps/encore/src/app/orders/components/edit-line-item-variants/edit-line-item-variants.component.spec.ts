import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  EditLineItemVariantsComponent,
  EditLineItemVariantsComponentModule,
} from './edit-line-item-variants.component';

describe('EditLineItemVariantsComponent', () => {
  let spectator: Spectator<EditLineItemVariantsComponent>;
  let component: EditLineItemVariantsComponent;

  const createComponent = createComponentFactory({
    component: EditLineItemVariantsComponent,
    imports: [EditLineItemVariantsComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
