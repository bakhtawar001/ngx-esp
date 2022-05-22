import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosProductGridComponent } from './product-grid.component';
import { CosProductGridModule } from './product-grid.module';

const props = {
  products: [
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
    { url: 'media/33807255', alt: '' },
  ],
};

describe('CosProductGridComponent', () => {
  let spectator: Spectator<CosProductGridComponent>;
  let component: CosProductGridComponent;

  const createComponent = createComponentFactory({
    component: CosProductGridComponent,
    imports: [CosProductGridModule],
  });

  beforeEach(() => {
    spectator = createComponent({ props });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.query('.cos-product-grid')).toBeTruthy();
  });
});
