import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProjectProductDetailPage,
  ProjectProductDetailPageModule,
} from './project-product-detail.page';

describe('ProjectProductDetailPage', () => {
  let spectator: Spectator<ProjectProductDetailPage>;
  let component: ProjectProductDetailPageModule;

  const createComponent = createComponentFactory({
    component: ProjectProductDetailPage,
    imports: [ProjectProductDetailPageModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
