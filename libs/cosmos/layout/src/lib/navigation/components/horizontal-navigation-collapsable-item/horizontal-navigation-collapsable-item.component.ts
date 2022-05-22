import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cos-horizontal-navigation-collapsable-item',
  templateUrl: './horizontal-navigation-collapsable-item.component.html',
  styleUrls: ['./horizontal-navigation-collapsable-item.component.scss'],
})
export class HorizontalNavigationCollapsableItemComponent
  implements OnInit, OnDestroy
{
  isOpen = false;

  @HostBinding('class')
  classes = 'nav-collapsable nav-item';

  @Input()
  item: any;

  // private _unsubscribeAll: Subject<void>;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    // this._configService.config$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(config => {
    //     this.config = config;
    //   });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    // this._unsubscribeAll.next();
    // this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open
   */
  @HostListener('mouseenter')
  open(): void {
    this.isOpen = true;
  }

  /**
   * Close
   */
  @HostListener('mouseleave')
  close(): void {
    this.isOpen = false;
  }
}

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HorizontalNavigationCollapsableItemComponent],
  exports: [HorizontalNavigationCollapsableItemComponent],
})
export class HorizontalNavigationCollapsableItemComponentModule {}
