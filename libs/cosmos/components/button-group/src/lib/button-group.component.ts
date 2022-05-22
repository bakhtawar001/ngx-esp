import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'cos-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosButtonGroupComponent {
  @Input() toggleAriaLabel?: string;
  @Input() toggleOptions: any[] = [];
  @Input() defaultSelection = '';
  @Input() groupName = '';
  @Input() selectedValue: any;

  @Output() handleSelection = new EventEmitter<MatButtonToggleChange>();

  selectionChanged(event: MatButtonToggleChange) {
    this.handleSelection.emit(event);
  }
}
