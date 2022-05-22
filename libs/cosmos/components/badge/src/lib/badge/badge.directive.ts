import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[cosBadge]',
})
export class CosBadgeDirective {
  @HostBinding() class = `cos-badge`;
}
