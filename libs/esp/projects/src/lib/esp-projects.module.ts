import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AlgoliaTasksInterceptor } from '@esp/search';
import { NgxsAfterSuccessModule } from '@cosmos/state';

import { ProjectSharedActions } from './actions';
import {
  ProjectCreateWithNewCustomerState,
  ProjectsRecentState,
  ProjectsSearchState,
  ProjectsState,
} from './states';

@NgModule()
export class EspProjectsModule {
  static forRoot(): ModuleWithProviders<RootEspProjectsModule> {
    return { ngModule: RootEspProjectsModule };
  }
}

@NgModule({
  imports: [
    NgxsModule.forFeature([
      ProjectsState,
      ProjectsRecentState,
      ProjectsSearchState,
      ProjectCreateWithNewCustomerState,
    ]),
    NgxsAfterSuccessModule,
  ],
  providers: [
    AlgoliaTasksInterceptor.create({
      urlPattern: /vulcan\/projects/,
      actionToDispatch: ProjectSharedActions.SearchIndexOperationComplete,
    }),
  ],
})
export class RootEspProjectsModule {}
