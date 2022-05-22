import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'supplierImageFromDomain',
})
export class SupplierImageFromDomainPipe implements PipeTransform {
  transform(value: string): any {
    const domain = value && value.replace(/.*@/, '');

    if (domain) {
      return 'https://logo.clearbit.com/' + domain;
    } else {
      return '/noimage.png';
    }
  }
}

@NgModule({
  declarations: [SupplierImageFromDomainPipe],
  exports: [SupplierImageFromDomainPipe],
})
export class SupplierImageFromDomainPipeModule {}
