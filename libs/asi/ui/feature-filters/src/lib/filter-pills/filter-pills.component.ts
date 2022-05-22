import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { CosPillModule } from '@cosmos/components/pill';
import { CosButtonModule } from '@cosmos/components/button';
import { CommonModule } from '@angular/common';

export interface FilterPill {
  ControlName: string;
  Label: string;
  Value?: string;
}

export interface RemoveFilterPayload {
  ControlName?: string;
  Value?: string;
  ClearAll?: boolean;
}

@Component({
  selector: 'asi-filter-pills',
  templateUrl: './filter-pills.component.html',
  styleUrls: ['./filter-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiFilterPillsComponent {
  @Output() removeFilterEvent = new EventEmitter<RemoveFilterPayload>();
  @Input() filterPills: FilterPill[] = [];

  removePill(params: RemoveFilterPayload): void {
    this.removeFilterEvent.emit(params);
  }
}

@NgModule({
  imports: [CosPillModule, CosButtonModule, CommonModule],
  declarations: [AsiFilterPillsComponent],
  exports: [AsiFilterPillsComponent],
})
export class AsiFilterPillsModule {}
