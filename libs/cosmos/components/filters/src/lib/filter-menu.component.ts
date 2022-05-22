import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cos-filter-menu',
  templateUrl: 'filter-menu.component.html',
  styleUrls: ['filter-menu.component.scss'],
  host: {
    class: 'cos-filter-menu',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosFilterMenuComponent implements OnDestroy {
  isDesktop = false;
  expanded = false;

  @Input() label!: string;
  @Input() applied = false;
  @Input() template!: string;
  @Input() disabled = false;
  @Input() applyDisabled = false;
  @Input() preventMenuClose = false;
  @Output() readonly apply = new EventEmitter<void>();
  @Output() readonly reset = new EventEmitter<void>();
  @Output() readonly clickOut = new EventEmitter<void>();
  @Output() readonly onToggle = new EventEmitter<boolean>();

  private subscription: Subscription;

  toggleState(): void {
    this.expanded = !this.expanded;
    this.onToggle.emit(this.expanded);
  }

  applyFilters(): void {
    if (!this.applyDisabled) {
      this.apply.emit();
      this.expanded = false;
    }
  }

  resetFilters(): void {
    this.reset.emit();
    this.expanded = false;
  }

  onClickedOutside(): void {
    if (this.expanded && !this.preventMenuClose) {
      this.expanded = false;
      this.clickOut.next();
    }
  }

  modalCloseCheck(event: KeyboardEvent): void {
    if (event.which === 9) this.expanded = false;
  }

  buttonCloseCheck(event: KeyboardEvent): void {
    if (event.shiftKey && event.which === 9) this.expanded = false;
  }

  constructor(
    breakpointObserver: BreakpointObserver,
    private _cdr: ChangeDetectorRef
  ) {
    this.subscription = breakpointObserver
      .observe(['(min-width: 1024px)'])
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe((result) => {
        this.isDesktop = result.matches;
        this._cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
