import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormArrayName,
  FormControlDirective,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { ReactiveComponent } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'asi-panel-editable-row-inactive',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AsiPanelEditableRowInactive {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'asi-panel-editable-row-active',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AsiPanelEditableRowActive {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'asi-panel-editable-row-controls',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AsiPanelEditableRowControls {}

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'asi-panel-editable-row-title',
  template: '<ng-content></ng-content>',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AsiPanelEditableRowTitle {}

@UntilDestroy()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'asi-panel-editable-row',
  styleUrls: ['./panel-editable-row.component.scss'],
  templateUrl: './panel-editable-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'panel-editable-row',
    '[class.panel-editable-row-is-editing]': 'isEditing$.value',
    '[class.full-width]': 'isFullWidth',
    '[class.custom-controls]': 'customControls',
  },
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AsiPanelEditableRow
  extends ReactiveComponent
  implements AfterViewInit
{
  canSave$ = new BehaviorSubject(false);
  controls = {
    edit: true,
    remove: false,
    expand: false,
  };
  initialValues: any;
  isEditing$ = new BehaviorSubject(false);

  @Input() isFullWidth = false;
  @Input() expanded = true;
  @Input() saveClick: (value: AbstractControl) => Observable<boolean>;
  @Input() rowTitle = '';
  @Input() isEditable = true;
  @Input() alwaysEdit = false;
  @Input() isLoading = false;
  @Input() saveButtonText = 'Save';
  @Input() set editingIsActive(value: boolean) {
    if (value) {
      this.enableEdit();
    } else if (this.state.isEditing) {
      this.cancelEdit();
    }
  }
  @Input() set visibleControls(
    controls: Partial<typeof AsiPanelEditableRow.prototype.controls>
  ) {
    for (const [key, value] of Object.entries(controls)) {
      // eslint-disable-next-line no-prototype-builtins
      controls.hasOwnProperty(key) ? (this.controls[key] = value) : false;
    }
  }

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaveEvent = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onCancelEvent = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onEditEvent = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onRemoveEvent = new EventEmitter<void>();
  @Output() addNewEvent = new EventEmitter<void>();

  @ContentChild(AsiPanelEditableRowControls)
  customControls!: AsiPanelEditableRowControls;

  @ContentChild(FormControlDirective)
  private formControl: FormControlDirective;

  @ContentChild(ControlContainer)
  private group: FormGroup;

  @ContentChild(FormArrayName)
  private arrayName: FormArrayName;

  @ContentChild(TemplateRef)
  public rowTitleTemplate: TemplateRef<any>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  get control() {
    return this.arrayName?.control || this.group || this.formControl?.control;
  }

  get hasValue() {
    let ret = this.control?.value;

    const hasValues = (values) => {
      for (const key of Object.keys(values)) {
        if (values[key]) {
          return true;
        }
      }

      return false;
    };

    if (this.control instanceof FormGroup) {
      const group = this.control as FormGroup;
      const values = group.value;
      ret = hasValues(values);
    }

    if (this.control instanceof FormGroupDirective) {
      const group = this.control.form as FormGroup;
      const values = group.value;

      ret = hasValues(values);
    }

    if (this.control instanceof FormArray) {
      ret = this.control.value.some((ctrl) => {
        const group = ctrl as FormGroup;
        return hasValues(group);
      });
    }

    return ret;
  }

  cancelEdit(): void {
    if (this.initialValues && this.control) {
      this.control.reset(this.initialValues);

      // resetting doesn't clear out entries from formarray if they were introduced
      if (this.arrayName) {
        for (
          let i = this.control.value.length - 1;
          i >= this.initialValues.length;
          i--
        ) {
          (this.control as FormArray).removeAt(i);
        }
      }
    }

    this.onCancelEvent.emit();

    this.isEditing$.next(false);
    this.canSave$.next(false);

    if (this.control?.markAsPristine) {
      this.control.markAsPristine();
    }
  }

  enableEdit(): void {
    this.onEditEvent.emit();

    if (!this.hasValue) {
      this.addNewEvent.emit();
    }

    this.setInitialValue();
    this.isEditing$.next(true);
  }

  ngAfterViewInit(): void {
    if (this.control && this.control.valueChanges) {
      this.control.valueChanges
        .pipe(
          distinctUntilChanged(),
          tap(() => {
            this.canSave$.next(this.control.dirty && this.control.valid);
            this._changeDetectorRef.markForCheck();
          }),
          untilDestroyed(this)
        )
        .subscribe();
    }
  }

  removeRow(): void {
    this.onRemoveEvent.emit();
  }

  saveRow(): void {
    if (!this.state.canSave) return;

    if (this.saveClick) {
      this.saveClick(this.control)
        .pipe(untilDestroyed(this))
        .subscribe((res) => res && this._saveRow());
    } else {
      this._saveRow();
    }
  }

  setInitialValue(): void {
    if (this.control) {
      this.initialValues = this.control.value;
    }
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  private _saveRow(): void {
    if (this.document.activeElement instanceof HTMLElement) {
      this.document.activeElement.blur();
    }

    this.isEditing$.next(false);
    this.onSaveEvent.emit();
    this.canSave$.next(false);

    if (this.control?.markAsPristine) {
      this.control.markAsPristine();
    }
  }

  protected override setState(): void {
    this.state = this.connect({
      canSave: this.canSave$,
      isEditing: this.isEditing$,
    });
  }
}

@NgModule({
  imports: [CommonModule, CosButtonModule],
  exports: [
    AsiPanelEditableRow,
    AsiPanelEditableRowInactive,
    AsiPanelEditableRowActive,
    AsiPanelEditableRowControls,
    AsiPanelEditableRowTitle,
  ],

  declarations: [
    AsiPanelEditableRow,
    AsiPanelEditableRowInactive,
    AsiPanelEditableRowActive,
    AsiPanelEditableRowControls,
    AsiPanelEditableRowTitle,
  ],
})
export class AsiPanelEditableRowModule {}
