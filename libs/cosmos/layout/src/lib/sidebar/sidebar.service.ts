import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { SidebarComponent } from './sidebar.component';
import { SetFolded, SidebarState } from './store';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Private
  private _registry: { [key: string]: SidebarComponent } = {};

  /**
   * Constructor
   */
  constructor(protected store: Store) {}

  /**
   * Add the sidebar to the registry
   *
   * @param key
   * @param sidebar
   */
  register(key: string, sidebar: SidebarComponent): void {
    // Check if the key already being used
    if (this._registry[key]) {
      console.error(
        `The sidebar with the key '${key}' already exists. Either unregister it first or use a unique key.`
      );

      return;
    }

    // Add to the registry
    this._registry[key] = sidebar;
  }

  /**
   * Remove the sidebar from the registry
   *
   * @param key
   */
  unregister(key: string): void {
    this.getSidebar(key);

    // Unregister the sidebar
    delete this._registry[key];
  }

  /**
   * Return the sidebar with the given key
   *
   * @param key
   */
  getSidebar(key: string): SidebarComponent | null {
    // Check if the sidebar exists
    if (!this._registry[key]) {
      console.warn(
        `The sidebar with the key '${key}' doesn't exist in the registry.`
      );

      return null;
    }

    // Return the sidebar
    return this._registry[key];
  }

  /**
   * Set sidebar folded state
   *
   * @param key
   * @param folded
   */
  setFolded(key: string, folded: boolean): void {
    this.getSidebar(key);

    this.store.dispatch(new SetFolded(key, folded));
  }

  /**
   * Retrieve sidebar folded state
   *
   * @param key
   */
  getFolded(key: string): boolean {
    this.getSidebar(key);

    return this.store.selectSnapshot<boolean>(SidebarState.getFolded(key));

    //return this.store.selectSnapshot<boolean>(SidebarState.getFolded.pipe(map(filterFn => filterFn(key));
  }
}
