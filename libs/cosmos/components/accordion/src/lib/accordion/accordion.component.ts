import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
} from '@angular/core';

@Component({
  selector: 'cos-accordion-header',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosAccordionHeaderComponent {}

@Component({
  selector: 'cos-accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cos-accordion',
    '[attr.aria-expanded]': 'expanded',
    '[attr.aria-disabled]': 'disabled',
    '[attr.data-cos-size]': 'size',
    '[class.cos-accordion--expanded]': 'expanded',
  },
})
export class CosAccordionComponent {
  @Input() size: '' | 'sm' | 'xs' = '';

  @Input() expanded = false;

  @Input() accordionTitle = '';

  @Input() disabled = false;

  @Input() hideToggle = false;

  @Output() readonly expandedChange = new EventEmitter<boolean>();

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {}

  /**
   * The `toggleExpandedState()` will be called within the root zone since the `click`
   * event listener has the `.silent` modifier. We won't trigger change detection if it's disabled.
   */
  toggleExpandedState(): void {
    ngDevMode && NgZone.assertNotInAngularZone();

    if (this.disabled) {
      return;
    }

    this.ngZone.run(() => {
      this.expanded = !this.expanded;
      this.expandedChange.next(this.expanded);
      this.ref.markForCheck();
    });
  }

  /**
   * The `onKeydown()` will be called within the root zone since the `keydown`
   * event listener has the `.silent` modifier. We won't trigger change detection on each
   * keyboard click, but only when the enter or space has been clicked.
   */
  onKeydown(event: KeyboardEvent): void {
    ngDevMode && NgZone.assertNotInAngularZone();

    if (event.keyCode !== SPACE && event.keyCode !== ENTER) {
      return;
    }

    if (hasModifierKey(event)) {
      return;
    }

    event.preventDefault();
    // The `toggleExpandedState()` will re-enter the Angular zone if needed.
    this.toggleExpandedState();
  }
}
