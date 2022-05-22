/* eslint-disable @angular-eslint/use-component-view-encapsulation */
import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChildren,
  Directive,
  NgModule,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-util-nav',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderUtilNav {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-actions',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderActions {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-img',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderImg {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-title',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderTitle {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-nav',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderNav {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-menu',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderMenu {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-tracker',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderTracker {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-notifications',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderNotifications {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'esp-detail-header-meta',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DetailHeaderMeta {}

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailHeaderComponent {
  @ContentChildren(DetailHeaderImg)
  _userProvidedImg: QueryList<DetailHeaderImg>;

  @ContentChildren(DetailHeaderTracker)
  _tracker: QueryList<DetailHeaderTracker>;

  @ContentChildren(DetailHeaderUtilNav as any, { descendants: true })
  _utilNav: QueryList<DetailHeaderUtilNav>;

  @ContentChildren(DetailHeaderNav)
  _subNav: QueryList<DetailHeaderNav>;
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    DetailHeaderActions,
    DetailHeaderComponent,
    DetailHeaderImg,
    DetailHeaderMenu,
    DetailHeaderMeta,
    DetailHeaderNav,
    DetailHeaderNotifications,
    DetailHeaderTitle,
    DetailHeaderTracker,
    DetailHeaderUtilNav,
  ],
  exports: [
    DetailHeaderActions,
    DetailHeaderComponent,
    DetailHeaderImg,
    DetailHeaderMenu,
    DetailHeaderMeta,
    DetailHeaderNav,
    DetailHeaderNotifications,
    DetailHeaderTitle,
    DetailHeaderTracker,
    DetailHeaderUtilNav,
  ],
})
export class DetailHeaderComponentModule {}
