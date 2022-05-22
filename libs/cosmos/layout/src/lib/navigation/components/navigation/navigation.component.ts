import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { ReactiveComponent } from '@cosmos/common';
import { BehaviorSubject, merge } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationService } from '../../services';
import { NavigationItem } from '../../types';
import { HorizontalNavigationCollapsableItemComponentModule } from '../horizontal-navigation-collapsable-item';
import { NavigationItemComponentModule } from '../navigation-item';
import { VerticalNavigationItemComponentModule } from '../vertical-navigation-item';
@Component({
  selector: 'cos-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent extends ReactiveComponent {
  @Input() layout = 'vertical';

  protected navigation$ = new BehaviorSubject<NavigationItem[]>([]);

  private _name!: string;

  /**
   * Constructor
   * @param {NavigationService} _navigationService
   */
  constructor(private _navigationService: NavigationService) {
    super();
  }

  @Input()
  get name() {
    return this._name;
  }
  set name(name: string) {
    if (name) {
      this.navigation$.next(this._navigationService.getNavigation(name));

      this._name = name;
    }
  }

  @Input()
  set navigation(navigation: NavigationItem[]) {
    this.navigation$.next(navigation);
  }

  protected override setState() {
    const navigationByName$ = merge(
      this._navigationService.onNavigationChanged$,
      this.onInit$.pipe(startWith(this.name))
    ).pipe(
      filter((key: any) => key && key === this.name),
      map((key: string) => this._navigationService.getNavigation(key))
    );

    const navigation$ = merge(this.navigation$, navigationByName$);

    this.state = this.connect({
      navigation: navigation$.pipe(
        map((navigation) => navigation?.filter((n) => !n.hidden))
      ),
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    NavigationItemComponentModule,
    VerticalNavigationItemComponentModule,
    HorizontalNavigationCollapsableItemComponentModule,
  ],
  declarations: [NavigationComponent],
  exports: [NavigationComponent],
})
export class NavigationComponentModule {}
