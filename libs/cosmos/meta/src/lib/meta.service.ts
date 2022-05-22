import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MetaSettings, META_SETTINGS } from './symbols';

const enum OpenGraphTag {
  Title = 'og:title',
}

@Injectable()
export class MetaService implements OnDestroy {
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(META_SETTINGS) private settings: MetaSettings
  ) {
    this.setupRouterEventsListener();
  }

  ngOnDestroy(): void {
    // Do not leak in unit tests.
    this.subscription.unsubscribe();
  }

  updateTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({
      property: OpenGraphTag.Title,
      content: title,
    });
  }

  private setupRouterEventsListener(): void {
    this.subscription = this.router.events
      .pipe(
        filter(
          (event): event is ActivationStart =>
            event instanceof ActivationStart && event.snapshot.data.meta
        )
      )
      .subscribe((event) => {
        const newTitle = this.getTitle(
          event.snapshot.data.meta.title || this.settings.defaults.title
        );

        this.updateTitle(newTitle);
      });
  }

  private getTitle(title: string): string {
    return (
      title + this.settings.pageTitleSeparator + this.settings.applicationName
    );
  }
}
