import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[cosAttributeTag]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'cos-attribute-tag' },
})
export class CosAttributeTagDirective {
  @Input() size = '';
  @HostBinding('class.cos-attribute-tag--small')
  get isSmall() {
    return this.size === 'small';
  }
}
