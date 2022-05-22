import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ɵɵdirectiveInject as inject,
} from '@angular/core';
import { CosAccordionComponent } from '@cosmos/components/accordion';

export type TrackerAccordionLabelThemePalette = 'complete' | 'warn' | undefined;

@Component({
  selector: 'cos-tracker-accordion-label',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosTrackerAccordionLabelComponent {}

@Component({
  selector: 'cos-tracker-accordion',
  templateUrl: 'tracker-accordion.component.html',
  styleUrls: [
    'tracker-accordion.component.scss',
    '../../../accordion/src/lib/accordion/accordion.component.scss',
  ],
  host: {
    class: 'cos-accordion cos-tracker-accordion',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosTrackerAccordionComponent extends CosAccordionComponent {
  private _status: TrackerAccordionLabelThemePalette;

  @Input() expandable = true;

  @Input()
  get status(): TrackerAccordionLabelThemePalette {
    return this._status;
  }
  set status(value: TrackerAccordionLabelThemePalette) {
    const host = this._host.nativeElement;
    const colorPalette = value;

    if (colorPalette !== this._status) {
      if (this._status) {
        host.classList.remove(`cos-tracker-accordion-${this._status}`);
      }

      if (colorPalette) {
        host.classList.add(`cos-tracker-accordion-${colorPalette}`);
      }

      this._status = colorPalette;
    }
  }

  private _host: ElementRef<HTMLElement> = inject(ElementRef);
}
