import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import {
  DirectorySearchPage,
  DirectorySearchPageModule,
} from './directory-search.page';

describe('DirectorySearchPage', () => {
  const createComponent = createComponentFactory({
    component: DirectorySearchPage,
    imports: [DirectorySearchPageModule, RouterTestingModule],
    providers: [
      mockProvider(Store, {
        select: (selector: any) => of('empty'),
      }),
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
  });

  it("should display the page header as 'Directory'", () => {
    // Arrange
    const { spectator } = testSetup();
    const header = spectator.query('.collection-header');

    // Assert
    expect(header).toHaveText('Directory');
  });
});
