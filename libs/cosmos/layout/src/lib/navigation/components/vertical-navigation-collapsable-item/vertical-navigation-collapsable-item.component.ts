import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { COSMOS_SLIDE_IN_OUT } from '@cosmos/animations';

import { NavigationService } from '../../services';
import { INavigationItem, NavigationItem } from '../../types';

@Component({
  selector: 'cos-vertical-navigation-collapsable-item',
  templateUrl: './vertical-navigation-collapsable-item.component.html',
  styleUrls: ['./vertical-navigation-collapsable-item.component.scss'],
  animations: [COSMOS_SLIDE_IN_OUT],
})
export class VerticalNavigationCollapsableItemComponent
  implements OnInit, OnDestroy
{
  @Input() item!: NavigationItem;

  @HostBinding('class') classes = 'nav-collapsable nav-item';

  @HostBinding('class.open') public isOpen = false;

  @Input() childTemplate: TemplateRef<{
    ['$implicit']: INavigationItem;
    index: number;
  }> | null = null;

  private _unsubscribeAll = new Subject<void>();

  /**
   * Constructor
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param _navigationService
   * @param _router
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigationService: NavigationService,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event: NavigationEnd) => {
        // Check if the url can be found in
        // one of the children of this item
        if (this.isUrlInChildren(this.item, event.urlAfterRedirects)) {
          this.expand();
        } else {
          this.collapse();
        }
      });

    // Listen for collapsing of any navigation item
    this._navigationService.onItemCollapsed
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((clickedItem) => {
        if (clickedItem && clickedItem.children) {
          // Check if the clicked item is one
          // of the children of this item
          if (this.isChildrenOf(this.item, clickedItem)) {
            return;
          }

          // Check if the url can be found in
          // one of the children of this item
          if (this.isUrlInChildren(this.item, this._router.url)) {
            return;
          }

          // If the clicked item is not this item, collapse...
          if (this.item !== clickedItem) {
            this.collapse();
          }
        }
      });

    // Check if the url can be found in
    // one of the children of this item
    if (this.isUrlInChildren(this.item, this._router.url)) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  toggleOpen(event: MouseEvent): void {
    event.preventDefault();

    this.isOpen = !this.isOpen;

    // Navigation collapse toggled...
    this._navigationService.onItemCollapsed.next(this.item);
    this._navigationService.onItemCollapseToggled.next();
  }

  /**
   * Expand the collapsable navigation
   */
  expand(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    this._changeDetectorRef.markForCheck();

    this._navigationService.onItemCollapseToggled.next();
  }

  /**
   * Collapse the collapsable navigation
   */
  collapse(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;

    this._changeDetectorRef.markForCheck();

    this._navigationService.onItemCollapseToggled.next();
  }

  /**
   * Check if the given parent has the
   * given item in one of its children
   *
   * @param parent
   * @param item
   * @returns {boolean}
   */
  isChildrenOf(parent: NavigationItem, item: NavigationItem): boolean {
    if (!parent.children) {
      return false;
    }

    if (parent.children.indexOf(item) !== -1) {
      return true;
    }

    for (const children of parent.children) {
      if (children.children) {
        return this.isChildrenOf(children, item);
      }
    }

    return false;
  }

  /**
   * Check if the given url can be found
   * in one of the given parent's children
   *
   * @param parent
   * @param url
   * @returns {boolean}
   */
  isUrlInChildren(parent: NavigationItem, url: string): boolean {
    if (!parent.children) {
      return false;
    }

    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i].children) {
        if (this.isUrlInChildren(parent.children[i], url)) {
          return true;
        }
      }

      if (parent?.children?.[i]?.url?.includes(url)) {
        return true;
      }
    }

    return false;
  }
}

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [VerticalNavigationCollapsableItemComponent],
  exports: [VerticalNavigationCollapsableItemComponent],
})
export class VerticalNavigationCollapsableItemComponentModule {}
