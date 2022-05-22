import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CosPillModule } from '@cosmos/components/pill';
import { FindLookupTypeValuePipeModule } from '@esp/lookup-types';
import { Address } from '@esp/models';

@Component({
  selector: 'esp-address-display',
  templateUrl: './address-display.component.html',
  styleUrls: ['./address-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AddressDisplayComponent {
  @Input() address: Address;
  @Input() inline = false;
  @Input() nameClass: string;
  @Input() bodyClass: string;
  @Input() showName = true;

  get hasAddress(): boolean {
    if (!this.address) return false;

    const {
      Name = '',
      City,
      CountryType,
      Line1,
      Line2,
      PostalCode,
      State,
    } = this.address;

    return !!`${this.showName ? Name ?? '' : ''}
      ${Line1 ?? ''}
      ${Line2 ?? ''}
      ${City ?? ''}
      ${State ?? ''}
      ${PostalCode ?? ''}
      ${CountryType ?? ''}`.trim().length;
  }
}

@NgModule({
  declarations: [AddressDisplayComponent],
  imports: [CommonModule, CosPillModule, FindLookupTypeValuePipeModule],
  exports: [AddressDisplayComponent],
})
export class AddressDisplayComponentModule {}
