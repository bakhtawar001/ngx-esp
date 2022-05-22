import { Injectable } from '@angular/core';
import { NavigationItem } from '../types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ActiveNavigationItemService {
  private readonly _activeItem = new BehaviorSubject<NavigationItem | null>(
    null
  );

  get activeItem$(): Observable<NavigationItem | null> {
    return this._activeItem.asObservable();
  }

  updateActiveItem(item: NavigationItem): void {
    this._activeItem.next(item);
  }
}
