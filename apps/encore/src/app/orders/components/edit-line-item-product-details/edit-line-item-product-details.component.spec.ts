import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  EditLineItemProductDetailsComponent,
  EditLineItemProductDetailsComponentModule,
} from './edit-line-item-product-details.component';

describe('EditLineItemProductDetailsComponent', () => {
  let spectator: Spectator<EditLineItemProductDetailsComponent>;
  let component: EditLineItemProductDetailsComponent;

  const createComponent = createComponentFactory({
    component: EditLineItemProductDetailsComponent,
    imports: [EditLineItemProductDetailsComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
