import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { arg } from '@cosmos/storybook';
import { CosPresentationCardComponent } from './presentation-card.component';
import markdown from './presentation-card.md';
import { CosPresentationCardModule } from './presentation-card.module';

const products = [
  { url: 'media/33807255', alt: 'Image 1' },
  { url: 'media/33807255', alt: 'Image 2' },
  { url: 'media/33807255', alt: 'Image 3' },
  { url: 'media/33807255', alt: 'Image 4' },
  { url: 'media/33807255', alt: 'Image 5' },
  { url: 'media/33807255', alt: 'Image 6' },
  { url: 'media/33807255', alt: 'Image 7' },
  { url: 'media/33807255', alt: 'Image 8' },
  { url: 'media/33807255', alt: 'Image 9' },
];

export default {
  title: 'Objects/Presentation Card',
  component: CosPresentationCardComponent,
  parameters: {
    notes: markdown,
  },
  args: {
    size: 'large',
    title: 'Very Lengthy Presentation Name Because We Like Robust Components',
    subtitle: 'Very Lengthy Company Name, LLC',
    imgUrl: 'https://via.placeholder.com/40',
    imgAlt: 'User profile for Bill Murray',
    topBorderColor: '#6A7281',
    createdDate: 'September 29, 2020',
    lastUpdatedDate: 'September 30, 2020',
  },
  argTypes: {
    size: {
      name: 'Size',
      control: 'select',
      options: ['large', 'small'],
    },
    whiteBg: arg('White Background?', 'boolean'),
    title: arg('Title'),
    subtitle: arg('Subtitle'),
    createdDate: arg('Created Date'),
    imgUrl: arg('Image URL'),
    imgAlt: arg('Image Alt Text'),
    lastUpdatedDate: arg('Last Updated Date'),
    topBorderColor: arg('Top Border Color', 'color'),
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, CosPresentationCardModule],
  },
  template: `<cos-presentation-card
    [title]="title"
    [subtitle]="subtitle"
    [createdDate]="createdDate"
    [lastUpdatedDate]="lastUpdatedDate"
    [lastUsedDate]="lastUsedDate"
    [imgUrl]="imgUrl"
    [imgAlt]="imgAlt"
    [showMenu]="showMenu"
    [whiteBg]="whiteBg"
    [size]="size"
    [topBorderColor]="topBorderColor"
    [products]="products"
     (handleClick)="clickTest()"
  >

      <ul class="cos-list-no-style px-16 my-0">
        <li class="mb-8">
          <a class="cos-text--black" href="#"><i class="fa fa-pen"></i> Edit</a>
        </li>
        <li>
          <a class="cos-text--red" href="#">
            <i class="fa fa-trash"></i> Delete</a
          >
        </li>
      </ul>

    </cos-presentation-card>`,
  props: {
    ...props,
    products: products,
    showMenu: true,
    clickTest: () => {
      console.log('test');
    },
  },
});

export const small = (props) => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, CosPresentationCardModule],
  },
  props,
});

small.args = {
  size: 'small',
  createdDate: '',
  lastUpdatedDate: '',
};

export const smallWithMetadata = (props) => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, CosPresentationCardModule],
  },
  props,
});

smallWithMetadata.args = {
  size: 'small',
};
