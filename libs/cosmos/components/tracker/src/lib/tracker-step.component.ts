import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CosTrackerComponent } from './tracker.component';

export type ThemePalette = 'green' | 'yellow' | undefined;
export type size = 'lg' | undefined;

@Component({
  selector: 'cos-tracker-step',
  templateUrl: 'tracker-step.component.html',
  styleUrls: ['tracker-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-tracker-step',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosTrackerStepComponent implements OnInit {
  parent!: CosTrackerComponent;
  index = 0;
  _color: ThemePalette;
  _size: size;

  @Input()
  get size(): size {
    return this._size;
  }
  set size(value: size) {
    const el = this._getHostElement() as HTMLElement;
    const circleSize = value;

    if (circleSize !== this._size) {
      if (this._size) {
        el.classList.remove(`cos-tracker-step--${this._size}`);
      }

      if (circleSize) {
        el.classList.add(`cos-tracker-step--${circleSize}`);
      }

      this._size = circleSize;
    }
  }

  @Input()
  get color(): ThemePalette {
    return this._color;
  }
  set color(value: ThemePalette) {
    const el = this._getHostElement() as HTMLElement;
    const colorPalette = value;

    if (colorPalette !== this._color) {
      if (this._color) {
        el.classList.remove(`cos-tracker-step--${this._color}`);
      }

      if (colorPalette) {
        el.classList.add(`cos-tracker-step--${colorPalette}`);
      }

      this._color = colorPalette;
    }
  }

  @HostBinding('style.left')
  get left() {
    const leftPosition = (100 / (this.parent.steps.length - 1)) * this.index;
    return `calc(${leftPosition + '%'})`;
  }

  @HostBinding('class.completed')
  get stepCompleted() {
    if (this.parent.startsOnZero) {
      return this.parent._percentage !== 100
        ? (100 / (this.parent.steps.length - 1)) * this.index <=
            this.parent._percentage
        : true;
    }

    return this.parent._percentage !== 100
      ? (100 / this.parent.steps.length) * this.index <= this.parent._percentage
      : true;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Helper methods
  // -----------------------------------------------------------------------------------------------------
  private _getHostElement() {
    return this._elementRef.nativeElement;
  }

  constructor(
    trackerComponent: CosTrackerComponent,
    private _elementRef: ElementRef
  ) {
    this.parent = trackerComponent;
  }

  ngOnInit() {
    this.parent.addStep(this);
  }
}
