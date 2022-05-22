import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationItem } from '../../types';

@Component({
  selector: 'cos-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrls: ['./navigation-item.component.scss'],
})
export class NavigationItemComponent {
  @HostBinding('class')
  classes: string = 'nav-item';

  @Input()
  item!: NavigationItem;
}

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavigationItemComponent],
  exports: [NavigationItemComponent],
})
export class NavigationItemComponentModule {}
