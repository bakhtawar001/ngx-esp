import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import { CosSupplierFooterComponent } from './supplier-footer.component';
import { CosSupplierModule } from './supplier.module';

const supplier = SuppliersMockDb.suppliers[0];

describe('CosSupplierFooterComponent', () => {
  let component: CosSupplierFooterComponent;
  let spectator: Spectator<CosSupplierFooterComponent>;

  const createComponent = createComponentFactory({
    component: CosSupplierFooterComponent,
    imports: [CosSupplierModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        supplier,
      },
    });

    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Contact Information link should be available as collapsed', () => {
    component.isExpanded = false;
    spectator.detectComponentChanges();
    expect('.cos-supplier-details').not.toExist();
  });

  it('Supplier information should be expanded and displayed', () => {
    component.isExpanded = true;
    spectator.detectComponentChanges();
    expect('.cos-supplier-details').toExist();
  });
});
