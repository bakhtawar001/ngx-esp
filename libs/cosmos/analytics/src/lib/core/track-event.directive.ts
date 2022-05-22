import { Directive, ElementRef, Input, NgModule, NgZone } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { CosAnalyticsService } from './analytics.service';

@UntilDestroy()
@Directive({ selector: '[cosTrackEvent]' })
export class CosTrackEventDirective {
  @Input() cosTrackEvent!: string;
  @Input() cosTrackEventOn = 'click';
  @Input() cosTrackEventProperties: Record<string, any> = {};

  constructor(
    private ngZone: NgZone,
    private host: ElementRef<HTMLElement>,
    private analytics: CosAnalyticsService
  ) {}

  ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.host.nativeElement, this.cosTrackEventOn, {
        capture: true,
        passive: true,
      })
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (event: Event) => this.track(event),
        });
    });
  }

  track(event: Event) {
    const action = this.cosTrackEvent;

    const properties: Record<string, any> = {
      ...this.cosTrackEventProperties,
      eventType: event.type,
    };

    this.analytics.track({
      action,
      properties,
    });
  }
}

@NgModule({
  declarations: [CosTrackEventDirective],
  exports: [CosTrackEventDirective],
})
export class CosTrackEventModule {}
