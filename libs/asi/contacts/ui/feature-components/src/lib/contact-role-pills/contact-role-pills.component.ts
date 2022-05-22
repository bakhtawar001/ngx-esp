import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CosPillModule } from '@cosmos/components/pill';
import { Company } from '@esp/models';

type PossibleRoleKeys = keyof Pick<
  Company,
  'AcknowledgementContact' | 'BillingContact' | 'ShippingContact'
>;

@Component({
  selector: 'asi-contact-role-pills',
  templateUrl: './contact-role-pills.component.html',
  styleUrls: ['./contact-role-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRolePillsComponent {
  @Input()
  contactId?: number;
  @Input()
  company!: Company;

  allowedRolesKeys: Record<PossibleRoleKeys, string> = {
    BillingContact: 'Billing',
    AcknowledgementContact: 'Order Approver',
    ShippingContact: 'Shipping',
  };
  readonly originalOrder = () => 0;
}

@NgModule({
  imports: [CommonModule, CosPillModule],
  declarations: [ContactRolePillsComponent],
  exports: [ContactRolePillsComponent],
})
export class ContactRolePillsModule {}
