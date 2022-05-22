import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

let id = 0;

@Component({
  selector: 'cos-input-row',
  templateUrl: 'input-row.component.html',
  styleUrls: ['input-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-input-row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosInputRowComponent {
  @Input() id = id++;
  @Input() allowRemove = false;
  @Input() allowDisable = false;
  @Input() disabled = false;

  @Output() readonly remove = new EventEmitter<{ id: number }>();
  @Output() readonly toggleDisabled = new EventEmitter<{
    id: number;
    disabled: boolean;
  }>();

  onClickDisabled() {
    this.disabled = !this.disabled;
    this.toggleDisabled.emit({ id: this.id, disabled: this.disabled });
  }

  onClickRemove() {
    this.remove.emit({ id: this.id });
  }
}
