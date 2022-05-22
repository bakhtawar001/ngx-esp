import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import type { TabFilter } from '../../types';
import { SearchLocalState, SEARCH_LOCAL_STATE } from '../../local-states';

@Component({
  selector: 'esp-search-tab-group',
  templateUrl: './search-tab-group.component.html',
  styleUrls: ['./search-tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SearchTabGroupComponent {
  @Input() tabs!: TabFilter[];

  constructor(
    @Inject(SEARCH_LOCAL_STATE) public readonly state: SearchLocalState
  ) {
    state.connect(this);
  }
}

@NgModule({
  imports: [CommonModule, MatTabsModule],
  declarations: [SearchTabGroupComponent],
  exports: [SearchTabGroupComponent],
})
export class EspSearchTabsModule {}
