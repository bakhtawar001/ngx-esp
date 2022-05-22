import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-explore-bar',
  templateUrl: './explore-bar.component.html',
  styleUrls: ['./explore-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-explore-bar',
  },
})
export class CosExploreBarComponent {
  _panelWidth: number | null = null;
  _panelLeft: number | null = null;

  @Input() ariaLabel?: string;
  @Input() navItems: any[] = []; // TODO: I don't know the type here...

  @ViewChild('menuRef', { static: true }) _menuRef!: ElementRef<HTMLElement>;

  private _setSizeAndPosition() {
    const barRect = this._menuRef.nativeElement.getBoundingClientRect();
    this._panelWidth = barRect.width;
    this._panelLeft = barRect.left;
  }

  onMenuOpened() {
    this._setSizeAndPosition();
  }
}
