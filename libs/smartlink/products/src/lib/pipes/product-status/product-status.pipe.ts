import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ProductSearchResultItem } from '@smartlink/models';

@Pipe({
  name: 'productStatus',
})
export class ProductStatusPipe implements PipeTransform {
  transform(product?: ProductSearchResultItem) {
    return product?.Ad?.Type === 'MTP'
      ? { Label: 'Most Popular', Color: 'blue', Type: 'MTP' }
      : null;
  }
}

@NgModule({
  declarations: [ProductStatusPipe],
  exports: [ProductStatusPipe],
})
export class ProductStatusPipeModule {}
