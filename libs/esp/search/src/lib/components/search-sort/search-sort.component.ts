import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SearchLocalState, SEARCH_LOCAL_STATE } from '../../local-states';
import type { SortOption } from '../../types';

@UntilDestroy()
@Component({
  selector: 'esp-search-sort',
  templateUrl: './search-sort.component.html',
  styleUrls: ['./search-sort.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SearchSortComponent {
  private state$ = this.state.connect(this);

  @Input() options: SortOption[];

  constructor(
    @Inject(SEARCH_LOCAL_STATE) public readonly state: SearchLocalState
  ) {}

  public setSort(option: SortOption): void {
    this.state.sort = option;
    // this.searchForm.patchValue({ sortBy: option.value });
  }
}

@NgModule({
  imports: [CommonModule, MatMenuModule, CosButtonModule],
  declarations: [SearchSortComponent],
  exports: [SearchSortComponent],
})
export class EspSearchSortModule {}
