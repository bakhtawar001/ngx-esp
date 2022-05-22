import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosProductVariantsComponent } from './product-variants.component';
import { CosProductVariantsModule } from './product-variants.module';

describe('CosProductVariantsComponent', () => {
  let component: CosProductVariantsComponent;
  let spectator: Spectator<CosProductVariantsComponent>;
  const createComponent = createComponentFactory({
    component: CosProductVariantsComponent,
    imports: [CosProductVariantsModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        hasImages: true,
        variant: {
          options: [],
        },
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('product color should be displayed correctly when no image availble', () => {
    component.variant.options = [
      {
        Code: 'MEGR',
        Name: 'Gray 014',
        ImageUrl: null,
        Options: [],
      },
    ];
    spectator.detectComponentChanges();
    const variants = spectator.queryAll('.cos-product-variants-description');
    const image = spectator.query('.cos-product-variants-image--empty');
    expect(image).toBeTruthy();
    expect(variants[0]).toContainText('Gray 014');
  });

  it('product color and image should be displayed correctly', () => {
    component.variant.options = [
      {
        Code: 'DRGR',
        Name: 'Charcoal Gray 025',
        ImageUrl: 'media/29022733',
        Options: [],
      },
    ];
    spectator.detectComponentChanges();
    const variants = spectator.queryAll('.cos-product-variants-description');
    const image = spectator.query('.cos-product-variants-image');
    expect(image).toBeTruthy();
    expect(variants[0]).toContainText('Charcoal Gray 025');
  });
});
