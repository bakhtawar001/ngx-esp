import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'cos-inline-edit',
  templateUrl: 'inline-edit.component.html',
  styleUrls: ['inline-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-inline-edit',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosInlineEditComponent implements OnInit {
  static ngAcceptInputType_readonly: BooleanInput;

  @Input() inputType = 'text';
  @Input() required = false;
  @Input() placeholder = '';
  @Input() initalValue?: string;
  @Input() maxLength: number | null = null;

  private _readonly = false;

  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(value: any) {
    this._readonly = coerceBooleanProperty(value);
  }

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  @ViewChild('input', { static: false }) input?: ElementRef<HTMLInputElement>;
  @ViewChild('inputTextarea', { static: false })
  inputTextarea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('display', { static: true }) display!: ElementRef<HTMLSpanElement>;

  isEditState = false;
  private prevValue = '';
  editValue!: FormControl;

  get userInputElRef() {
    return this.input || this.inputTextarea;
  }

  ngOnInit() {
    this.editValue = new FormControl(
      this.initalValue || '',
      this.required ? [Validators.required] : []
    );
  }

  toggleEditState() {
    this.isEditState = !this.isEditState;
    if (this.isEditState) {
      setTimeout(() => this.userInputElRef?.nativeElement.focus(), 0);
    }
  }

  updateInputValue($event: Event) {
    $event.stopPropagation();
    const text = this.display?.nativeElement.textContent!.trim();
    this.prevValue = text;
    this.editValue.setValue(text);

    this.toggleEditState();
  }

  updateDisplayValue($event: Event) {
    $event.stopPropagation();
    const newValue = this.userInputElRef?.nativeElement?.value || '';

    this.editValue.setValue(newValue.trim());

    if (!this.editValue.hasError('required')) {
      this.display.nativeElement.textContent = newValue;
      this.toggleEditState();
      if (this.editValue.value !== this.prevValue) {
        this.change.emit({ value: newValue });
      }
    }
  }

  cancelEdit($event: Event) {
    $event.stopPropagation();
    this.display.nativeElement.textContent = this.prevValue;
    this.editValue.setValue(this.prevValue);
    this.toggleEditState();
    return;
  }

  getErrorMessage() {
    if (this.editValue.hasError('required')) {
      return 'You must enter a value';
    } else {
      return '';
    }
  }
}
