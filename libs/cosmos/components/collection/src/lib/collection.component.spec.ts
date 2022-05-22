import { CollectionMockDb } from '@esp/collections/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosCollectionComponent } from './collection.component';
import { CosCollectionModule } from './collection.module';

describe('CosCollectionComponent', () => {
  let component: CosCollectionComponent;
  let spectator: Spectator<CosCollectionComponent>;

  const createComponent = createComponentFactory({
    component: CosCollectionComponent,
    imports: [CosCollectionModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        collection: CollectionMockDb.Collections[0],
        size: 'small',
      },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryAll('.cos-collection')).toBeTruthy();
  });

  it('User should be able to click on a collection at add products modal', () => {
    const cardButton = spectator.query('.cos-collection-card-trigger');
    expect(cardButton).toExist();
    expect(cardButton?.tagName).toBe('BUTTON');
    expect(cardButton).toHaveProperty('click');
  });
});
