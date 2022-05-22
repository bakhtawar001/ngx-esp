import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CosProductCardTagsComponent } from './product-card-tags.component';

describe('ProductCardTagsComponent', () => {
  let spectator: Spectator<CosProductCardTagsComponent>;
  const createComponent = createComponentFactory(CosProductCardTagsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
