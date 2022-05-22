import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockModule } from 'ng-mocks';
import { CollectionsDialogService } from '../../../collections/services';
import { SponsoredArticlePage } from './sponsored-article.page';

describe('SponsoredArticlePage', () => {
  const createComponent = createComponentFactory({
    component: SponsoredArticlePage,
    imports: [MockModule(NgxsModule.forRoot()), RouterTestingModule],
    providers: [mockProvider(CollectionsDialogService)],
    shallow: true,
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;

    return { spectator, component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });
});
