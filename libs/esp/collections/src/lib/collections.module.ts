import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AlgoliaTasksInterceptor } from '@esp/search';

import { CollectionsActions } from './actions';
import {
  CollectionProductsState,
  CollectionsSearchState,
  CollectionsState,
  RecentCollectionsState,
} from './states';

@NgModule()
export class EspCollectionsModule {
  static forRoot(): ModuleWithProviders<RootEspCollectionsModule> {
    return { ngModule: RootEspCollectionsModule };
  }
}

@NgModule({
  imports: [
    NgxsModule.forFeature([
      CollectionsState,
      CollectionsSearchState,
      CollectionProductsState,
      RecentCollectionsState,
    ]),
  ],
  providers: [
    AlgoliaTasksInterceptor.create({
      urlPattern: /zeal\/collections/,
      actionToDispatch: CollectionsActions.SearchIndexOperationComplete,
    }),
  ],
})
export class RootEspCollectionsModule {}
