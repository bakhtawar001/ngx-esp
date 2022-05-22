import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { debounceTime, repeat, takeUntil } from 'rxjs/operators';

@UntilDestroy()
@Directive({ selector: '[cosHover]' })
export class CosHoverEventDirective {
  @Input() duration = 500;
  @Output() cosHover = new EventEmitter<void>();

  constructor(el: ElementRef) {
    const enter$ = fromEvent<MouseEvent>(el.nativeElement, 'mouseenter');
    const leave$ = fromEvent<MouseEvent>(el.nativeElement, 'mouseleave');
    const down$ = fromEvent<MouseEvent>(el.nativeElement, 'mousedown');

    enter$
      .pipe(
        debounceTime(this.duration),
        takeUntil(leave$),
        // eslint-disable-next-line rxjs/no-unsafe-takeuntil
        takeUntil(down$),
        repeat()
      )
      .subscribe(() => {
        this.cosHover.emit();
      });
  }
}

@NgModule({
  declarations: [CosHoverEventDirective],
  exports: [CosHoverEventDirective],
})
export class CosHoverEventModule {}
