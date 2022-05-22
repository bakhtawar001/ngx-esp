import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosPresentationCardModule } from '@cosmos/components/presentation-card';
import { PresentationSearch } from '@esp/models';
import {
  EspSearchBoxModule,
  EspSearchPaginationModule,
  EspSearchSortModule,
  EspSearchTabsModule,
  SEARCH_LOCAL_STATE,
} from '@esp/search';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CreatePresentationFlow } from '../../../projects/flows';
import { PresentationCardMenuModule } from '../../components/presentation-card-menu/presentation-card-menu.component';
import {
  presentationTabs,
  sortMenuOptions,
} from './presentation-search.config';
import { PresentationSearchLoaderComponentModule } from './presentation-search.loader';
import { PresentationSearchLocalState } from './presentation-search.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-search',
  templateUrl: './presentation-search.page.html',
  styleUrls: ['./presentation-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CreatePresentationFlow,
    PresentationSearchLocalState,
    {
      provide: SEARCH_LOCAL_STATE,
      useExisting: PresentationSearchLocalState,
    },
  ],
})
export class PresentationSearchPage {
  private readonly state$ = this.state.connect(this);

  tabs = presentationTabs;
  sortMenuOptions = sortMenuOptions;

  constructor(
    public readonly state: PresentationSearchLocalState,
    private readonly createPresentationFlow: CreatePresentationFlow,
    private readonly _router: Router
  ) {}

  createPresentation() {
    this.createPresentationFlow.start();
  }

  navigateToPresentation(presentation: PresentationSearch) {
    this._router.navigateByUrl(
      `projects/${presentation?.Project.Id}/presentations/${presentation?.Id}`
    );
  }
}

@NgModule({
  declarations: [PresentationSearchPage],
  imports: [
    CommonModule,

    MatDialogModule,

    CosButtonModule,
    CosPresentationCardModule,

    EspSearchBoxModule,
    EspSearchPaginationModule,
    EspSearchSortModule,
    EspSearchTabsModule,

    PresentationSearchLoaderComponentModule,
    PresentationCardMenuModule,
  ],
  exports: [PresentationSearchPage],
})
export class PresentationSearchPageModule {}
