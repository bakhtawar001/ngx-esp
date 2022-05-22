import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import {
  AsiFilterPillsModule,
  RemoveFilterPayload,
} from '@asi/ui/feature-filters';
import { CosButtonModule } from '@cosmos/components/button';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { EspSearchBoxModule } from '@esp/search';
import {
  PROJECT_SEARCH_LOCAL_STATE,
  ProjectSearchLocalState,
} from '../../local-states';
import { ProjectSearchFiltersModule } from '../project-search-filters';

@Component({
  selector: 'esp-project-search-header',
  templateUrl: './project-search-header.component.html',
  styleUrls: ['./project-search-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSearchHeaderComponent {
  @Input()
  loaded: boolean;

  @Output()
  createOrder = new EventEmitter<void>();
  @Output()
  createPresentation = new EventEmitter<void>();

  constructor(
    @Inject(PROJECT_SEARCH_LOCAL_STATE)
    public readonly state: ProjectSearchLocalState
  ) {
    this.state.connect(this);
  }

  onCreateNewOrder(): void {
    this.createOrder.emit();
  }

  onCreateNewPresentation(): void {
    this.createPresentation.emit();
  }

  onRemoveFilter(payload: RemoveFilterPayload): void {
    this.state.removeFilter(payload);
  }
}

@NgModule({
  imports: [
    CommonModule,
    CosButtonModule,
    EspSearchBoxModule,
    MatMenuModule,
    FeatureFlagsModule,
    ProjectSearchFiltersModule,
    AsiFilterPillsModule,
  ],
  declarations: [ProjectSearchHeaderComponent],
  exports: [ProjectSearchHeaderComponent],
})
export class ProjectSearchHeaderModule {}
