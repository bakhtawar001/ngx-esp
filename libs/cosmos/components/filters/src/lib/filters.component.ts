import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';

@Component({
  selector: 'cos-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.scss'],
  host: {
    class: 'cos-filters',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosFiltersComponent {
  @Input() appliedFilters!: Record<string, unknown>;
  @Input() characterLimit = 10;
  @Input() hasFilters = false;
  @Input() title = '';
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @Output() resetFiltersEvent = new EventEmitter<void>();
  @Output() applyFiltersEvent = new EventEmitter<void>();

  get flatFilters() {
    const flatValues: any[] = [];

    if (this.appliedFilters) {
      const values = Object.values(this.appliedFilters);
      values.forEach((x: any) => {
        flatValues.push(...x);
      });
    }

    return flatValues;
  }

  isDesktop: Observable<BreakpointState>;

  constructor(
    breakpointObserver: BreakpointObserver,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.isDesktop = breakpointObserver.observe(['(min-width: 1024px)']);
  }

  menuOpened() {
    this.renderer.addClass(this.document.body, 'cdk-global-scrollblock');
  }

  menuClosed() {
    this.renderer.removeClass(this.document.body, 'cdk-global-scrollblock');
  }

  closeMenu() {
    this.menuTrigger.closeMenu();
  }

  resetFilters() {
    this.closeMenu();
    this.resetFiltersEvent.emit();
  }

  applyFilters() {
    this.closeMenu();
    this.applyFiltersEvent.emit();
  }
}
