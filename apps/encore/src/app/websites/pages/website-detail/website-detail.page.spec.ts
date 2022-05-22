import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  WebsiteDetailPage,
  WebsiteDetailPageModule,
} from './website-detail.page';

describe('WebsiteDetailPage', () => {
  const createComponent = createComponentFactory({
    component: WebsiteDetailPage,
    imports: [WebsiteDetailPageModule, RouterTestingModule.withRoutes([])],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });
});
