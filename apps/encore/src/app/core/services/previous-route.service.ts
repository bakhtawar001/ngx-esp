import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Params,
  Router,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class PreviousRouteService {
  private previousUrl: string;
  private currentUrl: string;
  private previousUrlParams: Params;
  private currentUrlParams: Params;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.currentUrl = this.router.url;
    this.currentUrlParams = this.route.snapshot.queryParams;

    router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe((event: NavigationStart) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;

        this.previousUrlParams = this.currentUrlParams;
        this.currentUrlParams = this.route.snapshot.queryParams;
      });
  }

  public getPreviousUrl() {
    return {
      url: this.previousUrl,
      params: this.previousUrlParams,
    };
  }
}
