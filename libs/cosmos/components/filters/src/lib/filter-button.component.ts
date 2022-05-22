import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { CosButtonComponent } from '@cosmos/components/button';

@Component({
  selector: 'button[cos-filter-button]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./filter-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosFilterButtonComponent extends CosButtonComponent {
  @Input()
  expanded = false;
  @Input()
  applied = false;

  // Private

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  @HostBinding('class')
  get classList() {
    const classNames = ['cos-filter-btn'];

    if (this.disabled) {
      classNames.push(`cos-filter-btn--disabled`);
    }

    if (this.applied) {
      classNames.push(`cos-filter-btn--applied`);
    }

    if (this.expanded) {
      classNames.push(`cos-filter-btn--expanded`);
    }

    return classNames.join(' ');
  }

  @HostBinding('attr.aria-expanded')
  get ariaExpanded() {
    return this.expanded;
  }
}
