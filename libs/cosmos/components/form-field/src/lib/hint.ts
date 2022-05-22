import { Directive, HostBinding, Input } from '@angular/core';
import { UniqueIdService } from '@cosmos/core';

/** Hint text to be shown underneath the form field control. */
@Directive({ selector: 'cos-hint' })
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class CosHint {
  /** Whether to align the hint label at the start or end of the line. */
  @Input()
  get align(): string {
    return this._align;
  }
  set align(value: string) {
    this._align = value;
  }
  private _align!: string;

  /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
  @Input() id = `${this._uniqueIdService.getUniqueIdForDom('cos-hint')}`;

  @HostBinding('class.cos-hint') hintClass = true;

  @HostBinding('class.cos-right')
  get alignRight() {
    return this._align === 'end';
  }

  @HostBinding('attr.id') attrId = this.id;

  @HostBinding('attr.align') attrAlign = null;

  constructor(private _uniqueIdService: UniqueIdService) {}
}
