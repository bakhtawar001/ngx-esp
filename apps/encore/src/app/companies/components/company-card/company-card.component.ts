import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { CompanySearch } from '@esp/models';
import { AddressDisplayComponentModule } from '../../../directory/components/address-display';
import { PartyAvatarComponentModule } from '../../../directory/components/party-avatar';
import { RecordOwnerComponentModule } from '../../../directory/components/record-owner/record-owner.component';
import { DEFAULT_COLOR } from '../../../settings/forms/company-brand-color-panel-row/company-brand-color-panel-row.form';
import { AsiCompanyActionsItemsModule } from '@asi/company/ui/feature-components';

@Component({
  selector: 'esp-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyCardComponent implements OnInit {
  @Input() company: CompanySearch;
  @Input() iconClass = 'fa fa-building';

  isCompany = false;
  defaultColor = DEFAULT_COLOR;

  @Output() toggleStatus = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() transferOwner = new EventEmitter<void>();

  ngOnInit() {
    this.isCompany = this.company.Types?.includes('Customer');

    this.getIconClass();
  }

  public _toggleStatus() {
    this.toggleStatus.next();
  }

  public _delete() {
    this.delete.next();
  }

  public _transferOwner() {
    this.transferOwner.next();
  }

  private getIconClass() {
    const types = this.company.Types || [];
    let iconClass = '';

    if (types.length > 1) {
      iconClass += 'building';
    } else if (types.includes('Customer')) {
      iconClass += 'users';
    } else if (types.includes('Supplier')) {
      iconClass += 'industry';
    } else if (types.includes('Decorator')) {
      iconClass += 'palette';
    } else {
      iconClass += 'building';
    }

    this.iconClass = 'fa fa-' + iconClass;
  }
}

@NgModule({
  declarations: [CompanyCardComponent],
  imports: [
    CommonModule,

    MatMenuModule,

    CosAttributeTagModule,
    CosCardModule,
    CosPillModule,

    AddressDisplayComponentModule,
    PartyAvatarComponentModule,
    RecordOwnerComponentModule,
    AsiCompanyActionsItemsModule,
  ],
  exports: [CompanyCardComponent],
})
export class CompanyCardComponentModule {}
