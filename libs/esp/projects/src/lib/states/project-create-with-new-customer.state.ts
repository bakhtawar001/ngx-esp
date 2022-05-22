import { Injectable } from '@angular/core';
import { CompanyFormModel } from '@asi/company/ui/feature-core';
import { ToastActions } from '@cosmos/components/notification';
import { CompaniesService } from '@esp/companies';
import { ContactsService } from '@esp/contacts';
import { Company, Contact, Project } from '@esp/models';
import { Action, State, StateContext } from '@ngxs/store';
import { firstValueFrom, Observable } from 'rxjs';
import {
  ProjectActions,
  ProjectCreateWithNewCustomerActions,
} from '../actions';
import { ProjectCreateWithNewCustomer, ProjectDetailsForm } from '../models';
import { TOAST_MESSAGES } from './toast-messages';

export interface ProjectCreateWithNewCustomerStateModel {
  creatingCustomer: boolean;
  creatingContact: boolean;
  creatingProject: boolean;
}

type ThisStateModel = ProjectCreateWithNewCustomerStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<ProjectCreateWithNewCustomerStateModel>({
  name: 'projectCreateWithNewCustomer',
  defaults: {
    creatingCustomer: false,
    creatingContact: false,
    creatingProject: false,
  },
})
@Injectable()
export class ProjectCreateWithNewCustomerState {
  constructor(
    private readonly _companiesService: CompaniesService,
    private readonly _contactsService: ContactsService
  ) {}

  @Action(ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer)
  async createProjectWithNewCustomer(
    ctx: ThisStateContext,
    {
      payload,
    }: ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer
  ) {
    payload = this.filterPayloadEmptyFields(payload);

    // CREATE CUSTOMER
    const customer = await this.createCustomer(
      ctx,
      this.mapProjectCreateCustomerFormToCompany(payload.customer)
    );

    // CREATE CONTACT
    await this.createContact(
      ctx,
      this.mapProjectCreateCustomerFormToContact(payload.customer, customer.Id),
      customer,
      payload.customer
    );

    // CREATE PROJECT
    await this.createProject(
      ctx,
      this.mapProjectDetailsFormToProject(payload.project, customer),
      payload.productIds
    );
  }

  private async createCustomer(
    ctx: ThisStateContext,
    payload: Company
  ): Promise<Company> {
    ctx.patchState({
      creatingCustomer: true,
    });

    try {
      const customer = await firstValueFrom(
        this.performCreateCustomerRequest(payload)
      );

      ctx.dispatch([
        new ToastActions.Show(TOAST_MESSAGES.COMPANY_CREATED(customer.Name)),
      ]);

      return customer;
    } catch (e) {
      ctx.dispatch(new ToastActions.Show(TOAST_MESSAGES.COMPANY_NOT_CREATED()));

      throw e;
    } finally {
      ctx.patchState({
        creatingCustomer: false,
      });
    }
  }

  private performCreateCustomerRequest(payload: Company): Observable<Company> {
    return this._companiesService.create(payload, {
      params: { ignoreConflict: 'true' },
    });
  }

  private async createProject(
    ctx: ThisStateContext,
    payload: Project,
    productIds: number[]
  ): Promise<void> {
    ctx.patchState({ creatingProject: true });

    try {
      await firstValueFrom(
        ctx.dispatch(new ProjectActions.CreateProject(payload, productIds))
      );
    } finally {
      ctx.patchState({ creatingProject: false });
    }
  }

  private async createContact(
    ctx: ThisStateContext,
    payload: Contact,
    customer: Company,
    formValue: CompanyFormModel
  ): Promise<Contact> {
    ctx.patchState({
      creatingContact: true,
    });

    try {
      const contact = await firstValueFrom(
        this.performCreateContactRequest(payload)
      );

      await firstValueFrom(
        this.assignContactToCustomer(customer, contact, formValue)
      );

      ctx.dispatch([
        new ToastActions.Show(
          TOAST_MESSAGES.CONTACT_CREATED(
            `${contact.GivenName} ${contact.FamilyName}`
          )
        ),
      ]);

      return contact;
    } catch (e) {
      ctx.dispatch(new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_CREATED()));

      throw e;
    } finally {
      ctx.patchState({
        creatingContact: false,
      });
    }
  }

  private performCreateContactRequest(contact: Contact): Observable<Contact> {
    return this._contactsService.create(contact);
  }

  private assignContactToCustomer(
    customer: Company,
    contact: Contact,
    payload: CompanyFormModel
  ): Observable<Partial<Company>> {
    return this._companiesService.save({
      ...customer,
      Links: [
        {
          Id: contact.Id,
          Comment: 'Primary Contact',
          Title: 'Primary Contact',
          Type: {
            Id: 1,
            Code: 'CONTACT',
            Forward: 'is a contact of',
            ForwardTitle: 'contact',
            Reverse: 'is the employer of',
            ReverseTitle: 'employer',
            ForPerson: true,
            ForCompany: true,
            IsEditable: true,
          },
          IsEditbale: true,
        },
      ],
      BillingContact: payload.CompanyInformation.IsBillingContact
        ? contact
        : customer.BillingContact,
      ShippingContact: payload.CompanyInformation.IsShippingContact
        ? contact
        : customer.ShippingContact,
      AcknowledgementContact: payload.CompanyInformation
        .IsAcknowledgementContact
        ? contact
        : customer.AcknowledgementContact,
    });
  }

  private mapProjectCreateCustomerFormToCompany(
    payload: CompanyFormModel
  ): Company {
    return {
      ...payload.CompanyInformation,
      ...payload.BrandInformation,
      Emails: payload.CompanyInformation.PrimaryEmail
        ? [payload.CompanyInformation.PrimaryEmail]
        : [],
      Phones: payload.CompanyInformation.Phone
        ? [payload.CompanyInformation.Phone]
        : [],
      Addresses: [
        {
          ...payload.CompanyInformation.Address,
          Name: payload.CompanyInformation.Name,
        },
      ],
      Websites: payload.BrandInformation.Website
        ? [payload.BrandInformation.Website]
        : [],
      PrimaryBrandColor: payload.BrandInformation.PrimaryBrandColor,
      IconMediaLink: payload.BrandInformation.IconMediaLink,
      LogoMediaLink: payload.BrandInformation.LogoMediaLink,
    } as Company;
  }

  private mapProjectCreateCustomerFormToContact(
    payload: CompanyFormModel,
    companyId: number
  ): Contact {
    return {
      GivenName: payload.CompanyInformation.GivenName,
      FamilyName: payload.CompanyInformation.FamilyName,
      Links: [
        {
          Comment: 'Primary Contact',
          Title: 'Primary Contact',
          Type: {
            Id: 1,
            Code: 'CONTACT',
            Forward: 'is a contact of',
            ForwardTitle: 'contact',
            Reverse: 'is the employer of',
            ReverseTitle: 'employer',
            ForPerson: true,
            ForCompany: true,
            IsEditable: true,
          },
          To: {
            Id: companyId,
          },
          IsEditbale: true,
          Reverse: true,
        },
      ],
      Emails: payload.CompanyInformation.PrimaryEmail
        ? [payload.CompanyInformation.PrimaryEmail]
        : [],
      Phones: payload.CompanyInformation.Phone
        ? [payload.CompanyInformation.Phone]
        : [],
      Addresses: [
        {
          ...payload.CompanyInformation.Address,
          Name: `${payload.CompanyInformation.GivenName} ${payload.CompanyInformation.FamilyName}`,
        },
      ],
      Websites: payload.BrandInformation.Website
        ? [payload.BrandInformation.Website]
        : [],
    } as Contact;
  }

  private mapProjectDetailsFormToProject(
    payload: ProjectDetailsForm,
    customer: Company
  ): Project {
    return {
      ...payload,
      Customer: customer,
      Budget: Number(payload.Budget.replace(/,/g, '')),
      NumberOfAssignees: Number(payload.NumberOfAssignees.replace(/,/g, '')),
    };
  }

  private filterPayloadEmptyFields(
    payload: ProjectCreateWithNewCustomer
  ): ProjectCreateWithNewCustomer {
    payload.customer = {
      CompanyInformation: {
        ...payload.customer.CompanyInformation,
        PrimaryEmail: payload.customer.CompanyInformation.PrimaryEmail?.Address
          .length
          ? payload.customer.CompanyInformation.PrimaryEmail
          : null,
        Phone: payload.customer.CompanyInformation.Phone?.Number
          ? payload.customer.CompanyInformation.Phone
          : null,
      },
      BrandInformation: {
        ...payload.customer.BrandInformation,
        Website: payload.customer.BrandInformation.Website?.Url
          ? payload.customer.BrandInformation.Website
          : null,
      },
    };

    return payload;
  }
}
