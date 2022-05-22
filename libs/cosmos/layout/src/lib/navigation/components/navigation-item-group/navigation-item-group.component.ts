import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, TemplateRef } from '@angular/core';
import { INavigationItem } from '../../types';
import { NavigationItemComponent } from '../navigation-item';

@Component({
  selector: 'cos-navigation-item-group',
  templateUrl: './navigation-item-group.component.html',
  styleUrls: ['./navigation-item-group.component.scss'],
})
export class NavigationItemGroupComponent extends NavigationItemComponent {
  override classes = 'nav-group nav-item';

  @Input() childTemplate: TemplateRef<{
    ['$implicit']: INavigationItem;
    index: number;
  }> | null = null;
}

@NgModule({
  imports: [CommonModule],
  declarations: [NavigationItemGroupComponent],
  exports: [NavigationItemGroupComponent],
})
export class NavigationItemGroupComponentModule {}
