import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';

export type ThemePalette = 'grey' | 'yellow' | 'red' | undefined;

@Component({
  selector: 'cos-context-icon',
  templateUrl: 'context-icon.component.html',
  styleUrls: ['context-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-context-icon',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosContextIconComponent {
  private _color: ThemePalette;
  private _icon!: string;

  @Input()
  get color(): ThemePalette {
    return this._color;
  }
  set color(value: ThemePalette) {
    const el = this.host.nativeElement;
    const colorPalette = value;

    if (colorPalette !== this._color) {
      if (this._color) {
        el.classList.remove(`cos-context-icon-${this._color}`);
      }

      if (colorPalette) {
        el.classList.add(`cos-context-icon-${colorPalette}`);
      }

      this._color = colorPalette;
    }
  }

  @Input()
  set icon(icon) {
    this._icon = `fa-${icon}`;
  }
  get icon() {
    return this._icon;
  }

  constructor(private host: ElementRef<HTMLElement>) {}
}
