import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosActionBarModule } from '@cosmos/components/action-bar';
import markdown from './product-navigation.md';
import { CosProductNavigationModule } from './product-navigation.module';

@Component({
  selector: 'cos-card-demo-component',
  template: `
    <cos-action-bar ngClass="cos-action-bar--products">
      <cos-product-navigation [products]="products" [backUrl]="backUrl">
      </cos-product-navigation>
    </cos-action-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosProductNavDemoComponent {
  backUrl = '#';

  products = [
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
    {
      title: 'Adult Softspun Semi-Fitted Tee',
      url: '#',
      quantity: '150',
      price: 20.0,
      img: 'media/33807255',
      alt: '',
    },
  ];
}

export default {
  title: 'Navigation/Product Navigation',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [CosProductNavDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosProductNavigationModule,
      CosActionBarModule,
    ],
  },
  component: CosProductNavDemoComponent,
  props: {},
});
