import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderSearch } from '@esp/models';
import { getProjectIdFromRoute } from '../../utils';

@Pipe({
  name: 'orderLink',
})
export class OrderLinkPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {OrderSearch} order
   * @param {ActivatedRoute} route
   * @returns {any[]}
   */
  transform(order: OrderSearch, route: ActivatedRoute): any[] {
    const projectId = getProjectIdFromRoute(route.snapshot);
    if (projectId) {
      return ['/projects', projectId, 'orders', order.Id];
    }

    return ['/orders', order.Id];
  }
}

@NgModule({
  declarations: [OrderLinkPipe],
  exports: [OrderLinkPipe],
})
export class OrderLinkPipeModule {}
