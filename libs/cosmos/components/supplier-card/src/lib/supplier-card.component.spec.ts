import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import { CosSupplierCardComponent } from './supplier-card.component';
import { CosSupplierCardModule } from './supplier-card.module';

const mockSupplier = SuppliersMockDb.suppliers[0];

const prop = {
  supplier: { ...mockSupplier },
};

describe('CosSupplierCardComponent', () => {
  let component: CosSupplierCardComponent;
  let spectator: Spectator<CosSupplierCardComponent>;
  const createComponent = createComponentFactory({
    component: CosSupplierCardComponent,
    imports: [CosSupplierCardModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { ...prop },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have image tag', () => {
    const img = spectator.query('img');
    expect(img).toExist();
  });

  it('should have attributes container', () => {
    const attr = spectator.query('.cos-supplier-card-attributes');
    expect(attr).toExist();
  });

  it('should have all tags', () => {
    component.showTags = true;
    component.supplier.SupplierTags = [];
    mockSupplier.Awards?.forEach((element) => {
      component.supplier.SupplierTags.push({ Label: element });
    });
    spectator.detectChanges();
    spectator.detectComponentChanges();
    const tags = spectator.queryAll('.cos-inline-list > li > span');
    expect(tags).toHaveLength(mockSupplier.Awards?.length);
  });
});
