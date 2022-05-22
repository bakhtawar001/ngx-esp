import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyInfoFormModel } from '@asi/company/ui/feature-core';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { CosInputRowModule } from '@cosmos/components/input-row';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import { CompaniesService } from '@esp/companies';
import { EspLookupSelectComponentModule } from '@esp/lookup-types';
import { EmailListFormModule, PhoneListFormModule } from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AsiCompanyAddressFormComponentModule } from '../company-address-form/company-address-form.component';

@UntilDestroy()
@Component({
  selector: 'asi-company-info-form',
  templateUrl: './company-info-form.component.html',
  styleUrls: ['./company-info-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCompanyInfoFormComponent
  extends FormGroupComponent<CompanyInfoFormModel>
  implements OnInit
{
  @Input() companyType?: string;
  @Input() isPreselectedCompanyType = false;
  @Input() data?: CompanyInfoFormModel;

  @ViewChild('companyName') companyName!: ElementRef;

  color = '';
  companyRoles = [
    { controlName: 'IsCustomer', name: 'Customer' },
    { controlName: 'IsSupplier', name: 'Supplier' },
    { controlName: 'IsDecorator', name: 'Decorator' },
  ];
  contactRoles = [
    { controlName: 'IsAcknowledgementContact', name: 'Order Approver' },
    { controlName: 'IsBillingContact', name: 'Billing' },
    { controlName: 'IsShippingContact', name: 'Shipping' },
  ];

  constructor(
    private readonly _companiesService: CompaniesService,
    private readonly _confirmDialogService: ConfirmDialogService
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.isPreselectedCompanyType) {
      this.companyRoles = [
        this.companyRoles.find((role) => role.name === this.companyType) ||
          this.companyRoles[0],
      ];
    }

    this.initDuplicateNameListener();
  }

  get emailFormGroup(): FormGroup {
    return this.form.controls.PrimaryEmail as FormGroup;
  }

  get phoneFormGroup(): FormGroup {
    return this.form.controls.Phone as FormGroup;
  }

  private initDuplicateNameListener(): void {
    this.form?.controls.Name?.valueChanges
      .pipe(
        switchMap((value) =>
          value ? this._companiesService.exists(value) : EMPTY
        ),
        untilDestroyed(this)
      )
      .subscribe({
        next: (exists: boolean) => this.confirmDuplicate(exists),
        error: (err) => console.log(err),
      });
  }

  private async confirmDuplicate(exists: boolean) {
    if (exists) {
      const confirmDialog = await firstValueFrom(
        this._confirmDialogService.confirm({
          message: `${this.form?.controls.Name?.value} already exists. Do you want to create a duplicate record?`,
          confirm: 'Yes',
          cancel: 'No',
        })
      );

      if (!confirmDialog) {
        this.companyName.nativeElement.focus();
      }

      return;
    }
  }
}

@NgModule({
  declarations: [AsiCompanyInfoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosButtonModule,
    CosCheckboxModule,
    CosInputModule,

    EmailListFormModule,
    PhoneListFormModule,
    EspLookupSelectComponentModule,
    CosInputRowModule,
    AsiCompanyAddressFormComponentModule,
  ],
  exports: [AsiCompanyInfoFormComponent],
})
export class AsiCompanyInfoFormComponentModule {}
