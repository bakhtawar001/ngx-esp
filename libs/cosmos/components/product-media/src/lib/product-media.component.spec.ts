import { UniqueIdService, VideoService } from '@cosmos/core';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { CosProductMediaComponent } from './product-media.component';
import { CosProductMediaModule } from './product-media.module';

const product = { ...ProductsMockDb.products[0], Media: [] };

const editMode = false;

describe('CosProductMediaComponent', () => {
  let spectator: Spectator<CosProductMediaComponent>;
  let component: CosProductMediaComponent;

  const createComponent = createComponentFactory({
    component: CosProductMediaComponent,
    imports: [CosProductMediaModule],
    providers: [mockProvider(VideoService), mockProvider(UniqueIdService)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        product,
        editMode,
      },
    });
    component = spectator.component;
  });

  describe('Product Media component', () => {
    it('Should show media component', () => {
      expect(component).toBeTruthy();
    });
  });
});
