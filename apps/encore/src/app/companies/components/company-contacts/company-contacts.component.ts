import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { Contact, LinkRelationship, Party } from '@esp/models';
import { ContactCardRowModule } from '../contact-card-row';
import { CompanyContactsLocalState } from './company-contacts.local-state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AbstractControl, FormArrayComponent, FormGroup } from '@cosmos/forms';
import {
  AsiDisplayPrimaryEmailPipeModule,
  AsiDisplayPrimaryPhonePipeModule,
  AsiPanelEditableRowModule,
  AsiPartyAutocompleteComponentModule,
  ConfirmDialogService,
} from '@asi/ui/feature-core';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { PartyAvatarComponentModule } from '../../../directory/components/party-avatar';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactCrudService } from '@asi/contacts/ui/feature-core';
import { CompaniesActions } from '@esp/companies';
import { ContactRolePillsModule } from '@asi/contacts/ui/feature-components';

interface ContactRole {
  IsAcknowledgementContact: boolean;
  IsBillingContact: boolean;
  IsShippingContact: boolean;
}

interface CreateCompanyContactLink {
  Link: LinkRelationship;
  ContactRole: ContactRole;
}

const CHANGING_CONTACT_ROLE_CONFIRMATION_DIALOG_DATA = {
  AcknowledgementContact: {
    message:
      "Another contact is currently assigned as the 'Primary Order Approver’ and this role will be removed from that contact record. Do you want to proceed?",
    cancel: 'No, I don’t want to apply this change',
    confirm: 'Yes, make this contact my primary contact',
  },
  BillingContact: {
    message:
      "Another contact is currently assigned as the 'Primary Billing Contact’ and this role will be removed from that contact record. Do you want to proceed?",
    cancel: 'No, I don’t want to apply this change',
    confirm: 'Yes, make this contact my billing contact',
  },
  ShippingContact: {
    message:
      "Another contact is currently assigned as the 'Primary Shipping Contact’ and this role will be removed from that contact record. Do you want to proceed?",
    cancel: 'No, I don’t want to apply this change',
    confirm: 'Yes, make this contact my shipping contact',
  },
};

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-company-contacts',
  templateUrl: './company-contacts.component.html',
  styleUrls: ['./company-contacts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CompanyContactsLocalState,
    ContactCrudService.withProviders({
      create: CompaniesActions.CreateContact,
    }),
  ],
})
export class CompanyContactsComponent
  extends FormArrayComponent<CreateCompanyContactLink>
  implements AfterContentInit
{
  contactRoleTooltip =
    'Primary contact roles identifies the company’s contact that is considered the primary order approver, billing and/or shipping person.  Each company is allowed to assign one primary contact role selection.';
  contactRoles = [
    { controlName: 'IsAcknowledgementContact', name: 'Primary Order Approver' },
    { controlName: 'IsBillingContact', name: 'Primary Billing Contact' },
    { controlName: 'IsShippingContact', name: 'Primary Shipping Contact' },
  ];
  activeRow: number | null = null;
  creatingMode = false;
  excludedList = '';

  constructor(
    readonly state: CompanyContactsLocalState,
    private readonly _route: ActivatedRoute,
    private readonly _confirmService: ConfirmDialogService,
    private readonly _contactCrudService: ContactCrudService
  ) {
    super();
  }
  override addItem(): void {
    if (this.form.valid) {
      super.addItem();
    }

    this.activeRow = this.groups.length - 1;
    this.creatingMode = true;
  }

  ngAfterContentInit(): void {
    this.state
      .connect(this)
      .pipe(
        map((x) => x.company),
        distinctUntilChanged(isEqual),
        filter(Boolean),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.resetForm();
      });
  }

  protected createArrayControl(): FormGroup<CreateCompanyContactLink> {
    return this._fb.group<CreateCompanyContactLink>({
      Link: this._fb.group<LinkRelationship>({
        Id: [0],
        Comment: [''],
        Title: [''],
        Type: [null],
        IsEditable: [false],
        To: [null, [Validators.required]],
        From: [null],
        Reverse: [false],
      }),
      ContactRole: this._fb.group<ContactRole>({
        IsAcknowledgementContact: [false],
        IsBillingContact: [false],
        IsShippingContact: [false],
      }),
    });
  }

  private resetForm(): void {
    const items = Object.assign(
      [],
      this.state?.company?.Links?.map((link) => ({
        ContactRole: {
          IsAcknowledgementContact:
            this.state.company?.AcknowledgementContact?.Id === link.To?.Id,
          IsBillingContact:
            this.state.company?.BillingContact?.Id === link.To?.Id,
          IsShippingContact:
            this.state.company?.ShippingContact?.Id === link.To?.Id,
        },
        Link: link,
      })) ?? []
    );

    this.excludedList = items.map((item) => item.Link.To.Id).join(',');
    this.form.reset(items);
  }

  private resetActiveRow(): void {
    this.activeRow = null;
    this.creatingMode = false;
  }

  async save(
    createCompanyContactLinkFormGroup?: FormGroup<CreateCompanyContactLink>
  ): Promise<void> {
    if (createCompanyContactLinkFormGroup?.dirty) {
      if (createCompanyContactLinkFormGroup.controls.Link.dirty) {
        this.saveLink(createCompanyContactLinkFormGroup.controls.Link.value);
      }
      if (createCompanyContactLinkFormGroup.controls.ContactRole.dirty) {
        await this.saveContactRole(
          createCompanyContactLinkFormGroup.controls.ContactRole.value,
          createCompanyContactLinkFormGroup.controls.Link.value
        );
      }
    }

    this.resetActiveRow();
    this._cdRef.markForCheck();
  }

  cancelEdit(): void {
    this.resetForm();
    this.resetActiveRow();
  }

  override removeItem(
    contactLink: AbstractControl<CreateCompanyContactLink>
  ): void {
    super.removeItem(contactLink);

    if (this.form.value.length === 0) {
      this.form.reset();
    }

    if (!this.creatingMode) {
      this.state.removeLink(contactLink.value.Link.Id);
    }

    this.resetActiveRow();
  }

  getPrimaryPhone(link: Partial<Party>): string {
    return link?.Phones?.filter((_) => _.IsPrimary)?.[0]?.Number || '-';
  }

  getPrimaryEmail(link: Partial<Party>): string {
    return link?.Emails?.filter((_) => _.IsPrimary)?.[0]?.Address || '-';
  }

  saveLink(link: LinkRelationship): void {
    if (this.creatingMode) {
      this.state.createLink(link);
    } else {
      this.state.patchLink(link);
    }
  }

  async saveContactRole(
    contactRole: ContactRole,
    link: LinkRelationship
  ): Promise<void> {
    const contact = link?.To as Contact;
    this.state.save({
      AcknowledgementContact: await this.prepareContactRolePayload(
        contactRole.IsAcknowledgementContact,
        this.state.company?.AcknowledgementContact,
        contact,
        CHANGING_CONTACT_ROLE_CONFIRMATION_DIALOG_DATA.AcknowledgementContact
      ),
      BillingContact: await this.prepareContactRolePayload(
        contactRole.IsBillingContact,
        this.state.company?.BillingContact,
        contact,
        CHANGING_CONTACT_ROLE_CONFIRMATION_DIALOG_DATA.BillingContact
      ),
      ShippingContact: await this.prepareContactRolePayload(
        contactRole.IsShippingContact,
        this.state.company?.ShippingContact,
        contact,
        CHANGING_CONTACT_ROLE_CONFIRMATION_DIALOG_DATA.ShippingContact
      ),
    });
  }

  private async prepareContactRolePayload(
    hasRoleApplied: boolean,
    contact: Contact,
    newContact: Contact,
    dialogData: { message?: string; confirm?: string; cancel?: string }
  ): Promise<Contact | null> {
    if (!hasRoleApplied && contact?.Id === newContact.Id) {
      return null;
    }

    const shouldChangeContact = await this.confirmChangingContactRole(
      hasRoleApplied,
      contact,
      newContact,
      dialogData
    );

    if (!shouldChangeContact && !this.creatingMode) {
      this.resetForm();
    }

    return shouldChangeContact ? newContact : contact;
  }

  private async confirmChangingContactRole(
    contactRoleSelected: boolean,
    oldContact: Contact | null,
    newContact: Contact,
    data?: { message?: string; confirm?: string; cancel?: string }
  ): Promise<boolean | null> {
    if (contactRoleSelected && oldContact && oldContact?.Id !== newContact.Id) {
      return await firstValueFrom(this._confirmService.confirm(data));
    } else if (contactRoleSelected && !oldContact) {
      return true;
    }

    return false;
  }

  async createContact(): Promise<void> {
    this.cancelEdit();

    await this._contactCrudService.create({
      CompanyPayload: {
        Company: this.state.company,
        Title: '',
      },
    });
  }
}

@NgModule({
  declarations: [CompanyContactsComponent],
  imports: [
    CommonModule,
    CosSegmentedPanelModule,
    AsiPanelEditableRowModule,
    ContactCardRowModule,
    ContactRolePillsModule,
    ReactiveFormsModule,
    RouterModule,
    CosButtonModule,
    PartyAvatarComponentModule,
    CosFormFieldModule,
    CosInputModule,
    CosCheckboxModule,
    AsiPartyAutocompleteComponentModule,
    AsiDisplayPrimaryEmailPipeModule,
    AsiDisplayPrimaryPhonePipeModule,
    MatTooltipModule,
  ],
  exports: [CompanyContactsComponent],
})
export class CompanyContactsComponentModule {}
