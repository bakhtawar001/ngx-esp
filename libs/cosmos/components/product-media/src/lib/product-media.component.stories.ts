import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import markdown from './product-media.md';
import { CosProductMediaModule } from './product-media.module';

const _product = {
  Id: 552224978,
  Name: 'Price Buster Cap 5 Panel - Embroidered',
  ImageUrl: 'media/35117192',
  Media: [
    {
      Name: '',
      Url: 'media/35117184',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: '',
      Url: 'media/35117192',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Black',
      Url: 'media/35117183',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Navy Blue',
      Url: 'media/35117186',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Royal Blue',
      Url: 'media/35117196',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Athletic Gold',
      Url: 'media/35117189',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Gray',
      Url: 'media/35117190',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Green',
      Url: 'media/35117191',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Kelly Green',
      Url: 'media/35117193',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Khaki',
      Url: 'media/35117185',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Orange',
      Url: 'media/35117194',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Pink',
      Url: 'media/35117195',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'Red',
      Url: 'media/35117187',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Name: 'White',
      Url: 'media/35117188',
      Type: 'IMG',
      Hidden: false,
    },
    {
      Id: 31182756,
      Type: 'VD',
      Url: 'https://vimeo.com/122338885',
      Hidden: false,
      thumbnailAlt: '',
    },
    {
      Id: 31182750,
      Type: 'VD',
      Url: 'https://www.youtube.com/watch?v=hCjwxIuH2VE',
      Hidden: false,
      thumbnailAlt: '',
    },
  ],
};

@Component({
  selector: 'cos-card-demo-component',
  template: `
    <cos-product-media
      (imageUploadEvent)="mockUpload($event)"
      (mediaToggleEvent)="mockToggleEvent($event)"
      [product]="product"
      [editMode]="editMode"
    >
    </cos-product-media>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosProductMediaDemoComponent {
  @Input() editMode = false;

  get product() {
    return _product;
  }

  mockToggleEvent(i) {
    _product.Media[i].Hidden = !_product.Media[i].Hidden;
  }

  mockUpload(event) {
    console.log(event);
    _product.Media.push({
      Name: '',
      Url: 'media/35117184',
      Type: 'IMG',
      Hidden: false,
    });
  }
}

export default {
  title: 'Composites/Product Media',
  parameters: {
    notes: markdown,
  },
  argTypes: {
    editMode: {
      name: 'Edit Mode',
      control: 'boolean',
    },
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosProductMediaDemoComponent],
    imports: [BrowserAnimationsModule, CosProductMediaModule],
  },
  component: CosProductMediaDemoComponent,
  props,
});

export const editMode = (props) => ({
  moduleMetadata: {
    declarations: [CosProductMediaDemoComponent],
    imports: [BrowserAnimationsModule, CosProductMediaModule],
  },
  component: CosProductMediaDemoComponent,
  props,
});

editMode.args = {
  editMode: true,
};
