import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosCollectionSectionComponent } from './collection-section.component';

describe('CosCollectionSectionComponent', () => {
  let component: CosCollectionSectionComponent;
  let spectator: Spectator<CosCollectionSectionComponent>;
  const createComponent = createComponentFactory({
    component: CosCollectionSectionComponent,
    declarations: [CosCollectionSectionComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
