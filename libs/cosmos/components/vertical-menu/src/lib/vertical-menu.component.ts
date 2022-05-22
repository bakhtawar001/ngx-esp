import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { NavigationItem } from '@cosmos/layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'cos-vertical-menu',
  templateUrl: 'vertical-menu.component.html',
  styleUrls: ['vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-vertical-menu',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosVerticalMenuComponent implements AfterViewInit {
  @ViewChild(MatMenuTrigger, { static: true }) menuTrigger!: MatMenuTrigger;
  @ViewChild(MatMenu, { static: true }) matMenu!: MatMenu;

  @Input() label?: string;
  @Input() menu: NavigationItem[] = [];
  @Input() activeItem: NavigationItem | null = null;

  constructor(private _cdr: ChangeDetectorRef) {}

  toggleMenu(): void {
    this._cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    this.menuTrigger.menuOpened.pipe(untilDestroyed(this)).subscribe(() => {
      this.matMenu.focusFirstItem();
    });
  }
}
