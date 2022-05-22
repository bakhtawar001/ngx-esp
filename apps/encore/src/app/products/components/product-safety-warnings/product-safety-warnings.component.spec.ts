import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Product } from '@smartlink/models';
import { ProductsMockDb } from '@smartlink/products/mocks';
import {
  FormatArrayListPipeModule,
  FormatArrayListPipe,
  Prop65PipeModule,
} from '@smartlink/products';
import { ProductSafetyWarningsComponent } from './product-safety-warnings.component';

describe('ProductSafetyWarningsComponent', () => {
  let spectator: Spectator<ProductSafetyWarningsComponent>;
  let product: Product;
  const createComponent = createComponentFactory({
    component: ProductSafetyWarningsComponent,
    declarations: [ProductSafetyWarningsComponent],
    imports: [FormatArrayListPipeModule, Prop65PipeModule],
  });

  beforeEach(() => {
    product = ProductsMockDb.products[0];

    spectator = createComponent({
      props: {
        product,
      },
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should display correct certificate details', () => {
    const pipe = new FormatArrayListPipe();
    const certifications = pipe.transform(product.Certifications, ',', 'Name');
    const certificationElement = spectator.query('.certifications-value');
    expect(certificationElement).toHaveExactText(` ${certifications} `);
  });

  it('should display correct safety warning', () => {
    const safetyWarningElements = spectator.queryAll(
      '.safety-warnings-description'
    );
    const warnings = product.Warnings.filter(
      (warning) => warning.Type === 'SWCH'
    );
    safetyWarningElements.forEach((warning, index) => {
      expect(warning).toHaveExactText(` ${warnings[index].Description} `);
    });
  });
  it('should display text "No safety warnings for this product" when no safety warnings are there', () => {
    product.Warnings = [
      {
        Name: '',
        Description: 'No safety warnings for this product',
        Warning: '',
        Type: 'SWCH',
      },
    ];
    spectator.detectChanges();
    const safetyWarningElements = spectator.queryAll(
      '.safety-warnings-description'
    );
    safetyWarningElements.forEach((warning, index) => {
      expect(warning).toHaveText('No safety warnings for this product');
    });
  });

  it('should not display certificates', () => {
    product.Certifications = null;
    spectator.detectChanges();
    expect(spectator.query('.content-section compliance')).not.toExist();
  });

  it('should not display safety warnings', () => {
    product.Warnings = [];
    spectator.detectChanges();
    expect(spectator.query('.content-section compliance')).not.toExist();
  });

  describe('Prop65 warnings', () => {
    it('should not display prop 65 warnings', () => {
      product.Warnings = [];
      spectator.detectChanges();
      expect(spectator.query('.content-section prop65')).not.toExist();
    });

    it('should display correct prop65 warning', () => {
      product.Warnings = [
        {
          Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Description: 'This product can expose you to chemicals like Lead',
          Warning:
            'Product can cause exposure to both a carcinogen and a reproductive toxicant',
          Type: 'PROP',
        },
      ];
      spectator.detectChanges();
      expect(
        spectator.query('.product-prop65-warning').innerHTML.trim()
      ).toContain(product.Warnings[0].Description);
    });
  });

  it('should show the no-prop-65 warning when prop65 not present', () => {
    product.HasProp65Warning = false;
    spectator.detectChanges();
    expect(spectator.query('.content-section prop65')).not.toExist();
    expect(spectator.query('.no-prop65-warning')).toExist();
    expect(spectator.query('.no-prop65-warning')).toHaveText(
      'Product does not contain Prop 65 chemicals'
    );
  });

  it('should not display Prop65AdditionalInfo', () => {
    product.Prop65AdditionalInfo = null;
    spectator.detectChanges();
    expect(spectator.query('.additional-info')).not.toExist();
  });

  it('should display correct additional info', () => {
    const additionalInfoElement = spectator.query('.additional-info');
    expect(additionalInfoElement).toHaveExactText(
      ` ${product.Prop65AdditionalInfo} `
    );
  });

  it('should display multiple prop65 warnings', () => {
    product.Warnings = [
      {
        Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Description: 'This product can expose you to chemicals like Lead',
        Warning:
          'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Type: 'PROP',
      },
      {
        Name: 'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Description: 'This product can expose you to chemicals like Ammonia',
        Warning:
          'Product can cause exposure to both a carcinogen and a reproductive toxicant',
        Type: 'PROP',
      },
    ];
    spectator.detectChanges();
    expect(
      spectator.queryAll('.product-prop65-warning')[0].innerHTML.trim()
    ).toContain(product.Warnings[0].Description);
    expect(
      spectator.queryAll('.product-prop65-warning')[1].innerHTML.trim()
    ).toContain(product.Warnings[1].Description);
  });
});
