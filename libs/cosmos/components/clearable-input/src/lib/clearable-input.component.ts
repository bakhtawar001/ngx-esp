import {
  Input,
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'cos-clearable-input',
  templateUrl: 'clearable-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosClearableInputComponent {
  @Input() id!: string;
  @Input() value!: string;
  @Input() showLabel?: string;
  @Input() type!: string;
  @Input() label!: string;
  @Input() errors = false;
  @Input() style = '';
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() placeholder = '';
  @Input() required = false;

  @Output() inputCleared = new EventEmitter<{ cleared_value: string }>();
  @Output() inputChanged = new EventEmitter<string>();

  _onValueChange(val: string) {
    this.inputChanged.emit(val);
  }
  clearInput() {
    this.inputCleared.emit({ cleared_value: this.value });
    this.value = '';
  }
}
