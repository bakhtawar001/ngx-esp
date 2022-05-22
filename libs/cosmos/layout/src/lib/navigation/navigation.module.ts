import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponentModule } from './components/navigation';
import { NavigationItemComponentModule } from './components/navigation-item';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    NavigationComponentModule,
    NavigationItemComponentModule,
  ],
  exports: [NavigationComponentModule, NavigationItemComponentModule],
})
export class NavigationModule {}
