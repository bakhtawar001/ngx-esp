import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { ControlRequiredPipeModule, FormGroupComponent } from '@cosmos/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CosInputModule } from '@cosmos/components/input';
import { OrderByPipeModule } from '@cosmos/common';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AsiPartyAutocompleteComponentModule } from '@asi/ui/feature-core';
import { LinkedCompany, Relationship } from '@esp/models';

@UntilDestroy()
@Component({
  selector: 'asi-linked-companies-form',
  templateUrl: './linked-companies-form.component.html',
  styleUrls: ['./linked-companies-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LinkedCompaniesFormComponent extends FormGroupComponent<LinkedCompany> {
  public readonly relationshipList: Relationship[] = [
    {
      Id: 500000002,
      Name: 'Customer',
      Code: 'CUSTOMER',
      LinkID: 3,
      Reverse: false,
      ForwardTitle: 'Customer',
      ReverseTitle: 'Supplier',
      ForCompany: true,
      ForPerson: true,
    },
    {
      Id: 500000002,
      Code: 'SUPPLIER',
      Name: 'Supplier',
      LinkID: 3,
      Reverse: true,
      ForwardTitle: 'Customer',
      ReverseTitle: 'Supplier',
      ForCompany: true,
      ForPerson: true,
    },
    {
      Id: 500000006,
      Code: 'AFFILIATE',
      Name: 'Affiliate',
      LinkID: 7,
      Reverse: false,
      ForwardTitle: 'Affiliate',
      ReverseTitle: 'Affiliate',
      ForCompany: true,
      ForPerson: true,
    },
    {
      Id: 500000007,
      Name: 'Parent company',
      Code: 'PARENT_COMPANY',
      LinkID: 8,
      Reverse: true,
      ForwardTitle: 'Parent company',
      ReverseTitle: 'Subsidiary',
      ForCompany: true,
      ForPerson: false,
    },
    {
      Id: 500000007,
      Name: 'Subsidiary',
      Code: 'SUBSIDIARY',
      LinkID: 8,
      Reverse: false,
      ForwardTitle: 'Parent company',
      ReverseTitle: 'Subsidiary',
      ForCompany: true,
      ForPerson: false,
    },
    {
      Id: 500000009,
      Name: 'Provide Services',
      Code: 'SERVICER',
      LinkID: 10,
      Reverse: true,
      ForwardTitle: 'Servicer',
      ReverseTitle: 'Client',
      ForCompany: true,
      ForPerson: true,
    },
    {
      Id: 500000009,
      Name: 'Client',
      Code: 'SERVICER',
      LinkID: 10,
      Reverse: false,
      ForwardTitle: 'Servicer',
      ReverseTitle: 'Client',
      ForCompany: true,
      ForPerson: true,
    },
    {
      Id: 5000000012,
      Name: 'Corresponds via email',
      Code: 'CORRESPONDENT',
      LinkID: 13,
      Reverse: false,
      ForwardTitle: 'Correspondent',
      ReverseTitle: 'Correspondent',
      ForCompany: true,
      ForPerson: true,
    },
  ];

  protected override createForm() {
    return this._fb.group<LinkedCompany>({
      Company: [null, Validators.required],
      Relationship: null,
    });
  }
}

@NgModule({
  declarations: [LinkedCompaniesFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CosInputModule,
    ControlRequiredPipeModule,
    OrderByPipeModule,
    AsiPartyAutocompleteComponentModule,
  ],
  exports: [LinkedCompaniesFormComponent],
})
export class AsiLinkedCompaniesFormModule {}
