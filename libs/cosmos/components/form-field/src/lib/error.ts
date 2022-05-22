import { Directive, HostBinding, Input } from '@angular/core';
import { UniqueIdService } from '@cosmos/core';

@Directive({
  selector: 'cos-error',
})
export class CosErrorDirective {
  @Input() id = `${this._uniqueIdService.getUniqueIdForDom('cos-error')}`;

  @HostBinding() class = `cos-error`;
  @HostBinding('attr.id') attrId = this.id;
  @HostBinding('attr.role') attrRole = 'alert';

  constructor(private _uniqueIdService: UniqueIdService) {}
}
