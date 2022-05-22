import { PercentPipe } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderPercent',
})
export class OrderPercentPipe implements PipeTransform {
  constructor(private readonly percentPipe: PercentPipe) {}

  /**
   * Transform
   *
   * @param {number} value
   * @returns {string}
   */
  transform(value: number): string {
    return this.percentPipe.transform(value, '1.2-2');
  }
}

@NgModule({
  declarations: [OrderPercentPipe],
  exports: [OrderPercentPipe],
  providers: [PercentPipe],
})
export class OrderPercentPipeModule {}
