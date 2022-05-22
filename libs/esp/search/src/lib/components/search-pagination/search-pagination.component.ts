import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CosPaginationModule } from '@cosmos/components/pagination';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SearchLocalState, SEARCH_LOCAL_STATE } from '../../local-states';
import { PageEvent } from '@angular/material/paginator/paginator';

@UntilDestroy()
@Component({
  selector: 'esp-search-pagination',
  templateUrl: './search-pagination.component.html',
  styleUrls: ['./search-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SearchPaginationComponent {
  constructor(
    @Inject(SEARCH_LOCAL_STATE) public readonly state: SearchLocalState
  ) {
    state.connect(this);
  }

  get maxPageNumbers() {
    if (!this.state.total) {
      return 0;
    }

    const totalPages = Math.ceil(
      this.state.total / (this.state.criteria?.size || 1)
    );

    return Math.min(totalPages, 6);
  }

  get pageSize() {
    return this.state.criteria?.size;
  }

  get pageIndex() {
    return this.state.criteria?.from - 1;
  }

  pageChange($event: PageEvent): void {
    this.state.from = $event.pageIndex + 1;
  }
}

@NgModule({
  imports: [CommonModule, CosPaginationModule],
  declarations: [SearchPaginationComponent],
  exports: [SearchPaginationComponent],
})
export class EspSearchPaginationModule {}
