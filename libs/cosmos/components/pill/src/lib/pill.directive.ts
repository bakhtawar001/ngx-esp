import { Directive, Input } from '@angular/core';

type ThemePalette = 'primary' | 'warn' | 'error' | 'success' | null;

@Directive({
  selector: '[cosPill]',
  host: {
    class: 'cos-pill',
    '[attr.data-cos-color]': 'color',
  },
})
export class CosPillDirective {
  @Input() color: ThemePalette = 'primary';
}

@Directive({
  selector: '[cosPillLabel]',
  host: {
    class: 'cos-pill-label',
    '[attr.data-cos-color]': 'color',
  },
})
export class CosPillLabelDirective {
  @Input() color: ThemePalette = 'primary';
}
