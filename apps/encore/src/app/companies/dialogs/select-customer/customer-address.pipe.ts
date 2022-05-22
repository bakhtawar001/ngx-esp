import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '@esp/models';

@Pipe({
  name: 'espCustomerAddress',
})
export class CustomerAddressPipe implements PipeTransform {
  transform(address: Address): string {
    const { Line1, Line2, City, State, PostalCode } = address;
    return [Line1, Line2, City, State, PostalCode].filter(Boolean).join(', ');
  }
}
