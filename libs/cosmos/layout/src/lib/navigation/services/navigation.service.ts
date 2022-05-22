import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { merge } from 'lodash-es';

import { Dictionary } from '@cosmos/core';
import { NavigationItem } from '../types';
import { tap, filter } from 'rxjs/operators';

export const COSMOS_NAVIGATION = new InjectionToken('COSMOS_NAVIGATION');

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  onItemCollapsed = new Subject<NavigationItem>();
  onItemCollapseToggled = new Subject<void>();

  // Private
  private _currentNavigationKey!: string;

  private _currentNavigation = new BehaviorSubject<NavigationItem[]>([]);
  private _onNavigationChanged = new BehaviorSubject<string>(null!);
  private _onNavigationRegistered = new BehaviorSubject<string>(null!);
  private _onNavigationUnregistered = new BehaviorSubject<string>(null!);

  private _registry: Dictionary<NavigationItem[]> = {};

  /**
   * Constructor
   */
  constructor() {
    this._onNavigationChanged
      .pipe(
        filter((key) => key === this._currentNavigationKey),
        tap((key) => this._currentNavigation.next(this.getNavigation(key)))
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get currentNavigation$() {
    return this._currentNavigation.asObservable();
  }

  /**
   * Get onNavigationChanged
   */
  get onNavigationChanged$() {
    return this._onNavigationChanged.asObservable();
  }

  /**
   * Get onNavigationRegistered
   */
  get onNavigationRegistered$() {
    return this._onNavigationRegistered.asObservable();
  }

  /**
   * Get onNavigationUnregistered
   */
  get onNavigationUnregistered$() {
    return this._onNavigationUnregistered.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register the given navigation
   * with the given key
   *
   * @param key
   * @param navigation
   */
  register(key: string, navigation: NavigationItem[]): void {
    // Check if the key already being used
    if (this._registry[key]) {
      console.error(
        `The navigation with the key '${key}' already exists. Either unregister it first or use a unique key.`
      );

      return;
    }

    // Add to the registry
    this._registry[key] = navigation;

    // Notify the subject
    this._onNavigationRegistered.next(key);
  }

  /**
   * Unregister the navigation from the registry
   * @param key
   */
  unregister(key: string): void {
    // Check if the navigation exists
    if (!this._registry[key]) {
      console.warn(
        `The navigation with the key '${key}' doesn't exist in the registry.`
      );
    }

    // Unregister the sidebar
    delete this._registry[key];

    // Notify the subject
    this._onNavigationUnregistered.next(key);
  }

  /**
   * Get navigation from registry by key
   *
   * @param key
   */
  getNavigation(key: string): NavigationItem[] {
    // Check if the navigation exists
    if (!this._registry[key]) {
      console.warn(
        `The navigation with the key '${key}' doesn't exist in the registry.`
      );

      return [];
    }

    // Return the sidebar
    return this._registry[key];
  }

  /**
   * Get flattened navigation array
   *
   * @param navigation
   * @param flatNavigation
   */
  getFlatNavigation(
    navigation: NavigationItem[],
    flatNavigation: NavigationItem[] = []
  ): NavigationItem[] {
    for (const item of navigation) {
      if (item.type === 'item') {
        flatNavigation.push(item);

        continue;
      }

      if (item.type === 'collapsable' || item.type === 'group') {
        if (item.children) {
          this.getFlatNavigation(item.children, flatNavigation);
        }
      }
    }

    return flatNavigation;
  }

  /**
   * Get navigation item by id from the
   * current navigation
   *
   * @param id
   * @param navigation
   */
  getNavigationItem(
    id: string,
    navigation: NavigationItem[] = []
  ): NavigationItem | boolean {
    for (const item of navigation) {
      if (item.id === id) {
        return item;
      }

      if (item.children) {
        const childItem = this.getNavigationItem(id, item.children);

        if (childItem) {
          return childItem;
        }
      }
    }

    return false;
  }

  /**
   * Get the parent of the navigation item
   * with the id
   *
   * @param id
   * @param navigation
   * @param parent
   */
  getNavigationItemParent(
    id: string,
    navigation: NavigationItem[] = [],
    parent: NavigationItem
  ): NavigationItem | boolean {
    for (const item of navigation) {
      if (item.id === id) {
        return parent;
      }

      if (item.children) {
        const childItem = this.getNavigationItemParent(id, item.children, item);

        if (childItem) {
          return childItem;
        }
      }
    }

    return false;
  }

  /**
   * Set the navigation with the key
   * as the current navigation
   *
   * @param key
   */
  setCurrentNavigation(key: string): void {
    const navigation = this.getNavigation(key);

    if (!navigation) return;

    // Set the current navigation key
    this._currentNavigationKey = key;

    // Notify the subject
    this._currentNavigation.next(navigation);
  }

  /**
   * Update navigation item with the given id
   *
   * @param id
   * @param properties
   */
  updateNavigationItem(
    id: string,
    properties: NavigationItem,
    key?: string
  ): void {
    key = key ?? this._currentNavigationKey;

    const navigation = this.getNavigation(key);

    // Get the navigation item
    const navigationItem = this.getNavigationItem(id, navigation);

    // If there is no navigation with the give id, return
    if (!navigationItem) {
      return;
    }

    // Merge the navigation properties
    merge(navigationItem, properties);

    // Trigger the observable
    this._onNavigationChanged.next(key);
  }
}
