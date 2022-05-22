import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import type { ButtonSize, ThemePalette } from './button.constants';

/**
 * List of classes to add to CosButton instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'cos-button',
  'cos-flat-button',
  'cos-icon-button',
  'cos-stroked-button',
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: `button[cos-button], button[cos-icon-button], button[cos-stroked-button],
             button[cos-flat-button]`,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.disabled]': 'disabled || null',
    '[class.cos-button-disabled]': 'disabled',
  },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosButtonComponent {
  private _color: ThemePalette;
  private _disabled = false;
  private _size: ButtonSize = null;

  @Input()
  get color(): ThemePalette {
    return this._color;
  }
  set color(value: ThemePalette) {
    const el = this._getHostElement() as HTMLElement;
    const colorPalette = value;

    if (colorPalette !== this._color) {
      if (this._color) {
        el.classList.remove(`cos-${this._color}`);
      }

      if (colorPalette) {
        el.classList.add(`cos-${colorPalette}`);
      }

      this._color = colorPalette;
    }
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input()
  get size(): ButtonSize {
    return this._size;
  }
  set size(value: ButtonSize) {
    const el = this._getHostElement() as HTMLElement;
    const size = value;

    if (size !== this._size) {
      if (this._size) {
        el.classList.remove(`cos-button--${this._size}`);
      }

      if (size) {
        el.classList.add(`cos-button--${size}`);
      }

      this._size = size;
    }
  }

  constructor(private _elementRef: ElementRef) {
    // For each of the variant selectors that is present in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this._hasHostAttributes(attr)) {
        (this._getHostElement() as HTMLElement).classList.add(attr);
      }
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Helper methods
  // -----------------------------------------------------------------------------------------------------
  protected _getHostElement() {
    return this._elementRef.nativeElement;
  }

  /** Gets whether the button has one of the given attributes. */
  private _hasHostAttributes(...attributes: string[]) {
    return attributes.some((attribute) =>
      this._getHostElement().hasAttribute(attribute)
    );
  }
}

@UntilDestroy()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: `a[cos-button], a[cos-icon-button], a[cos-stroked-button],
             a[cos-flat-button]`,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.disabled]': 'disabled || null',
    '[class.cos-button-disabled]': 'disabled',
  },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAnchorComponent extends CosButtonComponent implements OnInit {
  constructor(private ngZone: NgZone, elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(this._getHostElement(), 'click')
        .pipe(untilDestroyed(this))
        .subscribe((event) => {
          // A disabled button shouldn't apply any actions
          if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        });
    });
  }
}
