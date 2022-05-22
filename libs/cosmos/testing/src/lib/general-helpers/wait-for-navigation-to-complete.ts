import { NavigationEnd, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { first } from 'rxjs/operators';

export function waitForNavigationToComplete(
  router: Router
): Promise<NavigationEnd> {
  return firstValueFrom(
    router.events.pipe(
      first((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
  );
}
