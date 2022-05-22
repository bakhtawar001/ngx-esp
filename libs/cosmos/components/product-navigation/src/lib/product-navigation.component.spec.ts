import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosProductNavigationComponent } from './product-navigation.component';
import { CosProductNavigationModule } from './product-navigation.module';

class IntersectionObserverMock {
  readonly root: Element | null;

  readonly rootMargin: string;

  readonly thresholds: ReadonlyArray<number>;

  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
}

const products = [
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: '$20.00',
    img: 'media/33807255',
    alt: '',
  },
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: 20.0,
    img: 'media/33807255',
    alt: '',
  },
  {
    Name: 'Adult Softspun Semi-Fitted Tee',
    DefaultMedia: { Url: '#' },
    quantity: '150',
    price: 20.0,
    img: 'media/33807255',
    alt: '',
  },
];

window.IntersectionObserver = IntersectionObserverMock;

describe('CosProductNavigationComponent', () => {
  let component: CosProductNavigationComponent;
  let spectator: Spectator<CosProductNavigationComponent>;

  const createComponent = createComponentFactory({
    component: CosProductNavigationComponent,
    imports: [CosProductNavigationModule, RouterTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        products,
      },
    });
    component = spectator.component;
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
