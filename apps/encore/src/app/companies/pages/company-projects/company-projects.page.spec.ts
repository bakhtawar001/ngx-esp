import { RouterTestingModule } from '@angular/router/testing';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { SEARCH_LOCAL_STATE } from '@esp/search';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { AddToOrderFlow } from '../../../orders/flows';
import { CreatePresentationFlow } from '../../../projects/flows';
import { PROJECT_SEARCH_LOCAL_STATE } from '../../../projects/local-states';
import { ProjectsDialogService } from '../../../projects/services';
import { CompanyProjectsFiltersCacheService } from './company-projects-filters-cache.service';
import { CompanyProjectsPageLocalState } from './company-projects-page.local-state';
import {
  CompanyProjectsPage,
  CompanyProjectsPageModule,
} from './company-projects.page';

describe('CompanyProjectsPage', () => {
  const createComponent = createComponentFactory({
    component: CompanyProjectsPage,
    imports: [
      CompanyProjectsPageModule,
      RouterTestingModule,
      NgxsModule.forRoot(),
    ],
  });

  const testSetup = () => {
    const stateMock = {
      connect: () => of(this),
      criteria: {
        from: 1,
      },
      sort: {
        name: '',
      },
    };
    const spectator = createComponent({
      providers: [
        mockProvider(AddToOrderFlow),
        mockProvider(CreatePresentationFlow),
        mockProvider(CollaboratorsDialogService),
        mockProvider(CompanyProjectsPageLocalState, stateMock),
        {
          provide: PROJECT_SEARCH_LOCAL_STATE,
          useValue: stateMock,
        },
        {
          provide: SEARCH_LOCAL_STATE,
          useValue: stateMock,
        },
        mockProvider(CompanyProjectsFiltersCacheService),
        mockProvider(ProjectsDialogService),
      ],
    });

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });
});
