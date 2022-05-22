import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  EditLineItemChargesComponent,
  EditLineItemChargesComponentModule,
} from './edit-line-item-charges.component';

describe('EditLineItemChargesComponent', () => {
  let spectator: Spectator<EditLineItemChargesComponent>;
  let component: EditLineItemChargesComponent;

  const createComponent = createComponentFactory({
    component: EditLineItemChargesComponent,
    imports: [EditLineItemChargesComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
