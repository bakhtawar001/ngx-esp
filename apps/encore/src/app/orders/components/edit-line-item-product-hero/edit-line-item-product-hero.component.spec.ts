import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  EditLineItemProductHeroComponent,
  EditLineItemProductHeroComponentModule,
} from './edit-line-item-product-hero.component';

describe('EditLineItemProductHeroComponent', () => {
  let spectator: Spectator<EditLineItemProductHeroComponent>;
  let component: EditLineItemProductHeroComponent;

  const createComponent = createComponentFactory({
    component: EditLineItemProductHeroComponent,
    imports: [EditLineItemProductHeroComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
