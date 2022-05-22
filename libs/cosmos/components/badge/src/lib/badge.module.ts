import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CosBadgeDirective } from './badge/badge.directive';

@NgModule({
  imports: [CommonModule],
  exports: [CosBadgeDirective],
  declarations: [CosBadgeDirective],
})
export class CosBadgeModule {}
