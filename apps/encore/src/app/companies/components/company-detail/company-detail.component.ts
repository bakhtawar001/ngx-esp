import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  AsiCreditTermsPanelFormModule,
  AsiMinimumMarginPanelFormModule,
  AsiSalesTargetPanelFormModule,
  AsiTaxPanelFormModule,
  FINANCIAL_DETAILS_LOCAL_STATE,
} from '@asi/ui/feature-financial-details';
import { CosButtonModule } from '@cosmos/components/button';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { Company, PhoneTypeEnum } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import { PhoneListPanelRowFormModule } from '../../../settings/components/phone-list-panel-row';
import { AddressListPanelFormModule } from '../../../settings/forms/address-list-panel';
import { EmailListPanelRowFormModule } from '../../../settings/forms/email-list-panel-row';
import { CompanyBrandColorPanelRowFormModule } from '../../forms/company-brand-color-panel-row';
import { CompanyFaviconPanelRowFormModule } from '../../forms/company-favicon-panel-row';
import { CompanyLogoRowFormModule } from '../../forms/company-logo-row';
import { CompanyNameRowFormModule } from '../../forms/company-name-row';
import { CompanySocialMediaRowFormModule } from '../../forms/company-social-media-row';
import { CompanyTypeRowFormModule } from '../../forms/company-type-row';
import { CompanyWebsiteListPanelRowFormModule } from '../../forms/company-website-list-panel-row';
import { CompanyDetailLocalState } from '../../local-states';
import { AsiLinkedCompaniesPanelFormModule } from '@asi/company/ui/feature-components';

@UntilDestroy()
@Component({
  selector: 'esp-company-detail',
  templateUrl: './company-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CompanyDetailLocalState,
    {
      provide: FINANCIAL_DETAILS_LOCAL_STATE,
      useExisting: CompanyDetailLocalState,
    },
    { provide: PARTY_LOCAL_STATE, useExisting: CompanyDetailLocalState },
  ],
})
export class CompanyDetailComponent implements OnInit {
  readonly defaultPhoneType = PhoneTypeEnum.Office;

  company!: Company;
  isEditable = false;

  private readonly state$ = this.state.connect(this);

  constructor(
    @Inject(PARTY_LOCAL_STATE) private readonly state: PartyLocalState
  ) {}

  ngOnInit(): void {
    this.state$
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map(({ party }) => party),
        untilDestroyed(this)
      )
      .subscribe((company: Company) => {
        this.company = company;
        this.isEditable = company.IsEditable;
      });
  }
}

@NgModule({
  declarations: [CompanyDetailComponent],
  imports: [
    CommonModule,

    AddressListPanelFormModule,
    CosButtonModule,
    CosSegmentedPanelModule,
    CompanyNameRowFormModule,
    CompanyTypeRowFormModule,
    CompanyLogoRowFormModule,
    CompanyBrandColorPanelRowFormModule,
    CompanyFaviconPanelRowFormModule,
    CompanyWebsiteListPanelRowFormModule,
    CompanySocialMediaRowFormModule,
    EmailListPanelRowFormModule,

    PhoneListPanelRowFormModule,
    AsiMinimumMarginPanelFormModule,
    AsiSalesTargetPanelFormModule,
    AsiTaxPanelFormModule,
    AsiCreditTermsPanelFormModule,
    AsiLinkedCompaniesPanelFormModule,
  ],
  exports: [CompanyDetailComponent],
})
export class CompanyDetailComponentModule {}
