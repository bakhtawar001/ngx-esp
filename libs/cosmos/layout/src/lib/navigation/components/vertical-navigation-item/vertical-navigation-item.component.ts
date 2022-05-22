import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationItem } from '../../types';
import { NavigationItemComponentModule } from '../navigation-item';
import { NavigationItemGroupComponentModule } from '../navigation-item-group';
import { VerticalNavigationCollapsableItemComponentModule } from '../vertical-navigation-collapsable-item';

@Component({
  selector: 'cos-vertical-navigation-item',
  templateUrl: './vertical-navigation-item.component.html',
  styleUrls: ['./vertical-navigation-item.component.scss'],
})
export class VerticalNavigationItemComponent {
  @Input() item!: NavigationItem;
  constructor() {}
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavigationItemComponentModule,
    NavigationItemGroupComponentModule,
    VerticalNavigationCollapsableItemComponentModule,
  ],
  declarations: [VerticalNavigationItemComponent],
  exports: [VerticalNavigationItemComponent],
})
export class VerticalNavigationItemComponentModule {}
