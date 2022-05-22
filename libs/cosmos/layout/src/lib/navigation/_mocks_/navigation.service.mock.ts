import { NavigationItem } from '@cosmos/layout';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockNavigationService {
  currentNavigation$ = new BehaviorSubject<NavigationItem[]>(this.navigation);
  onNavigationChanged$ = new Observable();
  onNavigationRegistered$ = new Observable();
  onNavigationUnregistered$ = new Observable();

  constructor(private navigation: NavigationItem[]) {}

  register() {}

  unregister() {}

  getNavigation() {
    return [];
  }

  getFlatNavigation() {
    return [];
  }

  getNavigationItem() {
    return false;
  }
}
