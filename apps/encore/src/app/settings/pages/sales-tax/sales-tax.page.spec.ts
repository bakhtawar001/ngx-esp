import {
  CosAddressFormComponent,
  CosAddressFormModule,
} from '@cosmos/components/address-form';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { QuillModule } from 'ngx-quill';
import { SalesTaxPage, SalesTaxPageModule } from './sales-tax.page';

describe('SalesTaxPage', () => {
  let spectator: Spectator<SalesTaxPage>;
  let component: SalesTaxPage;

  const createComponent = createComponentFactory({
    component: SalesTaxPage,
    imports: [NgxsModule.forRoot(), QuillModule.forRoot(), SalesTaxPageModule],
    overrideModules: [
      [
        CosAddressFormModule,
        {
          set: {
            declarations: MockComponents(CosAddressFormComponent),
            exports: MockComponents(CosAddressFormComponent),
          },
        },
      ],
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
