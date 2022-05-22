import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCollectionModule } from '@cosmos/components/collection';
import { CosToastService } from '@cosmos/components/notification';
import { trackItem } from '@cosmos/core';
import {
  Collection,
  CollectionsActions,
  CollectionSearch,
  SearchCriteria,
} from '@esp/collections';
import {
  EspSearchBoxModule,
  EspSearchPaginationModule,
  EspSearchSortModule,
  EspSearchTabsModule,
  SEARCH_LOCAL_STATE,
} from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { CollectionCardMenuComponentModule } from '../../components/collection-card-menu/collection-card-menu.component';
import { sortOptions } from '../../configs';
import { CollectionsDialogService } from '../../services';
import { tabs } from './collection-search.config';
import { CollectionSearchLoaderComponentModule } from './collection-search.loader';
import { CollectionSearchLocalState } from './collection-search.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-collection-search-page',
  templateUrl: './collection-search.page.html',
  styleUrls: ['./collection-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CollectionSearchLocalState,
    {
      provide: SEARCH_LOCAL_STATE,
      useExisting: CollectionSearchLocalState,
    },
  ],
})
export class CollectionSearchPage {
  tabs = tabs;
  trackCollection = trackItem<CollectionSearch>(['Id']);
  sortMenuOptions = sortOptions;

  constructor(
    public readonly state: CollectionSearchLocalState,
    private _router: Router,
    private _toastService: CosToastService,
    private readonly _collectionsDialogService: CollectionsDialogService,
    private readonly _actions$: Actions
  ) {
    state.connect(this);

    this._actions$
      .pipe(
        ofActionDispatched(CollectionsActions.SearchIndexOperationComplete),
        untilDestroyed(this)
      )
      .subscribe({
        next: () => this.search(),
      });
  }

  public navigateToCollection(collection: Collection) {
    this._router.navigate(['/collections', collection.Id], {
      state: {
        navigationName: 'Back to Collections',
      },
    });
  }

  createCollection() {
    this._collectionsDialogService
      .openCreateDialog(null, true)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (collection) => {
          if (collection) {
            this._router.navigate(['/collections', collection.Id]).then(() => {
              this._toastService.success(
                'Success: Collection created!',
                `Your collection ${collection.Name} has been created.`
              );
            });
          }
        },
        error: () => {
          this._toastService.error(
            'Collection not created.',
            'Collection was unable to be created.'
          );
        },
      });
  }

  search(): void {
    this.state.search(this.state.criteria as SearchCriteria);
  }
}

@NgModule({
  declarations: [CollectionSearchPage],
  imports: [
    CommonModule,

    MatDialogModule,

    CosButtonModule,
    CosCollectionModule,
    CollectionCardMenuComponentModule,
    CollectionSearchLoaderComponentModule,

    EspSearchBoxModule,
    EspSearchPaginationModule,
    EspSearchSortModule,
    EspSearchTabsModule,
  ],
})
export class CollectionSearchPageModule {}
