import { Injectable } from '@angular/core';
import { ToastActions } from '@cosmos/components/notification';
import {
  EntityStateModel,
  getDefaultOperationStatus,
  ModelWithLoadingStatus,
  optimisticUpdate,
  setEntityStateItem,
  syncLoadProgress,
} from '@cosmos/state';
import { ContactsService } from '@esp/contacts';
import { Company, Contact, LinkRelationship } from '@esp/models';
import { RecentsActions } from '@esp/recently-viewed';
import { Navigate } from '@ngxs/router-plugin';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { EMPTY, firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CompaniesActions } from '../actions';
import { CreateCompanyPayload } from '../models';
import { CompaniesService } from '../services';
import { TOAST_MESSAGES } from './toast-messages';

const ACCEPTABLE_CACHE_SIZE = 5 as const;

export interface CompaniesStateModel
  extends ModelWithLoadingStatus,
    EntityStateModel<Company> {
  links: LinkRelationship[];
}

type ThisStateContext = StateContext<CompaniesStateModel>;

const defaultState = (): CompaniesStateModel => ({
  links: [],
  loading: getDefaultOperationStatus(),
  items: {},
  itemIds: [],
});

@State<CompaniesStateModel>({
  name: 'companies',
  defaults: defaultState(),
})
@Injectable()
export class CompaniesState {
  constructor(
    private readonly _service: CompaniesService,
    private readonly _contactsService: ContactsService
  ) {}

  /**
   * Commands
   */

  @Action(CompaniesActions.Get)
  private getById(ctx: ThisStateContext, { id }: CompaniesActions.Get) {
    ctx.patchState({ currentId: id });

    return this._service.get(id).pipe(
      syncLoadProgress(ctx),
      tap((company) =>
        ctx.setState(
          setEntityStateItem(id, company, { cacheSize: ACCEPTABLE_CACHE_SIZE })
        )
      ),
      tap((company) =>
        ctx.dispatch(new RecentsActions.AddRecentCompany(company))
      )
    );
  }

  @Action(CompaniesActions.Patch)
  private patch(ctx: ThisStateContext, { payload }: CompaniesActions.Patch) {
    const state = ctx.getState();
    const company = state.items[state.currentId];
    const updatedCompany = { ...company, ...payload } as Company;

    return this._service.save(updatedCompany).pipe(
      optimisticUpdate<Company>(updatedCompany, {
        getValue: () => ctx.getState().items[payload.Id],
        setValue: () =>
          ctx.setState(setEntityStateItem(updatedCompany.Id, updatedCompany)),
      }),
      catchError(() => {
        ctx.dispatch(new ToastActions.Show(TOAST_MESSAGES.COMPANY_NOT_SAVED()));

        return EMPTY;
      })
    );
  }

  @Action(CompaniesActions.GetLinks)
  private getLinks(ctx: ThisStateContext, { id }: CompaniesActions.GetLinks) {
    ctx.patchState({ links: [] });

    return this._service.links(id).pipe(
      tap((links) => {
        ctx.patchState({ links });
      })
    );
  }

  @Action(CompaniesActions.CreateLink)
  private createLink(
    ctx: ThisStateContext,
    { payload }: CompaniesActions.CreateLink
  ) {
    return this._service.createLink(payload.link, payload.companyId).pipe(
      switchMap(() =>
        this.reloadCompanyLinks(payload.companyId, ctx).pipe(
          tap(() => {
            if (!payload.link.To.IsCompany) {
              ctx.dispatch(
                new ToastActions.Show(
                  TOAST_MESSAGES.CONTACT_LINK_CREATED(payload.link.To.Name)
                )
              );
            }
          }),
          catchError(() => {
            if (!payload.link.To.IsCompany) {
              ctx.dispatch(
                new ToastActions.Show(TOAST_MESSAGES.CONTACT_LINK_NOT_CREATED())
              );
            }

            return EMPTY;
          })
        )
      )
    );
  }

  @Action(CompaniesActions.PatchLink)
  private patchLink(
    ctx: ThisStateContext,
    { payload }: CompaniesActions.PatchLink
  ) {
    return this._service
      .patchLink(payload.link, payload.companyId, payload.linkId)
      .pipe(
        tap(() => {
          const state = ctx.getState();
          const company = state.items[state.currentId];
          const updatedCompany = {
            ...company,
            Links: company.Links.map((link) =>
              link.Id === payload.linkId ? payload.link : link
            ),
          } as Company;

          ctx.setState(setEntityStateItem(updatedCompany.Id, updatedCompany));

          if (!payload.link.To.IsCompany) {
            ctx.dispatch(
              new ToastActions.Show(
                TOAST_MESSAGES.CONTACT_LINK_UPDATED(payload.link.To.Name)
              )
            );
          }
        }),
        catchError(() => {
          if (!payload.link.To.IsCompany) {
            ctx.dispatch(
              new ToastActions.Show(TOAST_MESSAGES.CONTACT_LINK_NOT_UPDATED())
            );
          }

          return EMPTY;
        })
      );
  }

  @Action(CompaniesActions.RemoveLink)
  private removeLink(
    ctx: ThisStateContext,
    { payload }: CompaniesActions.RemoveLink
  ) {
    return this._service.removeLink(payload.companyId, payload.linkId).pipe(
      tap(() => {
        const state = ctx.getState();
        const company = state.items[state.currentId];
        const updatedCompany = {
          ...company,
          Links: company.Links.filter((link) => link.Id !== payload.linkId),
        } as Company;

        ctx.setState(setEntityStateItem(updatedCompany.Id, updatedCompany));
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_LINK_REMOVED())
        );
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_LINK_NOT_REMOVED())
        );

        return EMPTY;
      })
    );
  }

  @Action(CompaniesActions.Create)
  private async create(
    ctx: ThisStateContext,
    { company }: CompaniesActions.Create
  ) {
    // CREATE COMPANY
    const newCompany = await this.createCompany(ctx, company as Company);

    // CREATE CONTACT
    await this.createContact(
      ctx,
      this.mapCreateCompanyPayloadToContact(company, newCompany.Id)
    );
  }

  @Action(CompaniesActions.CreateContact)
  private async createContactForCompany(
    ctx: ThisStateContext,
    { contact }: CompaniesActions.CreateContact
  ) {
    // CREATE CONTACT
    await this.createContact(ctx, contact);

    await firstValueFrom(this.reloadCompanyLinks(contact.Links[0].To.Id, ctx));
  }

  @Action(CompaniesActions.TransferOwnership)
  private transferOwnership(
    ctx: ThisStateContext,
    { company, newOwner }: CompaniesActions.TransferOwnership
  ) {
    return this._service.transferOwner(company.Id, newOwner.Id).pipe(
      tap(() => {
        const state = ctx.getState();

        if (state.currentId === company.Id) {
          ctx.dispatch(new CompaniesActions.Get(company.Id));
        }

        ctx.dispatch([
          new ToastActions.Show(
            TOAST_MESSAGES.OWNERSHIP_TRANSFERRED(newOwner.Name)
          ),
        ]);
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.OWNERSHIP_NOT_TRANSFERRED(newOwner.Name)
          )
        );
        return EMPTY;
      })
    );
  }

  @Action(CompaniesActions.Delete)
  private delete(ctx: ThisStateContext, { company }: CompaniesActions.Delete) {
    return this._service.validateDelete(company.Id).pipe(
      switchMap(({ IsDeletable }) => {
        if (!IsDeletable) return throwError(() => IsDeletable);

        return this._service.delete(company.Id);
      }),
      tap(() => {
        ctx.dispatch([
          new ToastActions.Show(
            TOAST_MESSAGES.DELETE_COMPANY_SUCCESS(company.Name)
          ),
          new Navigate(['directory/companies']),
        ]);
      }),
      catchError((err) => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.DELETE_COMPANY_FAIL(err))
        );
        return EMPTY;
      })
    );
  }

  @Action(CompaniesActions.ToggleStatus)
  private toggleStatus(
    ctx: ThisStateContext,
    { id, isActive }: CompaniesActions.ToggleStatus
  ) {
    const company = ctx.getState().items[id];

    return this._service.setStatus(id, isActive).pipe(
      tap(() => {
        if (company) {
          ctx.setState(
            setEntityStateItem(id, {
              ...company,
              IsActive: !company.IsActive,
            } as Company)
          );
        }

        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.TOGGLE_COMPANY_STATUS_SUCCESS(isActive)
          )
        );
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.TOGGLE_COMPANY_STATUS_FAIL(isActive)
          )
        );
        return EMPTY;
      })
    );
  }

  private async createCompany(
    ctx: ThisStateContext,
    company: Company
  ): Promise<Company> {
    try {
      const newCompany = await firstValueFrom(
        this.performCreateCompanyRequest(company)
      );

      if (newCompany.Id)
        ctx.setState(setEntityStateItem(newCompany.Id, newCompany));

      ctx.dispatch(
        new ToastActions.Show(
          TOAST_MESSAGES.CREATE_COMPANY_SUCCESS(newCompany.Name)
        )
      );

      ctx.dispatch(new Navigate(['/companies', newCompany.Id]));

      return newCompany;
    } catch (e) {
      ctx.dispatch(new ToastActions.Show(TOAST_MESSAGES.CREATE_COMPANY_FAIL()));

      throw e;
    }
  }

  private performCreateCompanyRequest(company: Company): Observable<Company> {
    return this._service.create(company, {
      params: { ignoreConflict: 'true' },
    });
  }

  private async createContact(
    ctx: ThisStateContext,
    payload: Contact
  ): Promise<Contact> {
    try {
      const contact = await firstValueFrom(
        this.performCreateContactRequest(payload)
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
    }
  }

  private performCreateContactRequest(contact: Contact): Observable<Contact> {
    return this._contactsService.create(contact);
  }

  private mapCreateCompanyPayloadToContact(
    payload: Partial<CreateCompanyPayload>,
    companyId: number
  ): Contact {
    return {
      GivenName: payload?.GivenName,
      FamilyName: payload?.FamilyName,
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
      Emails: payload.Emails ? payload.Emails : [],
      Phones: payload.Phones ? payload.Phones : [],
      Addresses: payload.Addresses ? payload.Addresses : [],
      Websites: payload.Websites ? payload.Websites : [],
    } as Contact;
  }

  private reloadCompanyLinks(
    companyId: number,
    ctx: ThisStateContext
  ): Observable<Company> {
    return this._service.get(companyId).pipe(
      tap((company) => {
        const state = ctx.getState();
        const oldCompany = state.items[state.currentId];
        const updatedCompany = {
          ...oldCompany,
          Links: company.Links,
        } as Company;

        ctx.setState(setEntityStateItem(updatedCompany.Id, updatedCompany));
      })
    );
  }
}
