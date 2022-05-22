import { Injectable } from '@angular/core';
import { ToastActions } from '@cosmos/components/notification';
import type { ModelWithLoadingStatus } from '@cosmos/state';
import { syncLoadProgress } from '@cosmos/state';
import type { ContactSearch } from '@esp/models';
import { Contact } from '@esp/models';
import type { SearchStateModel } from '@esp/search';
import { Navigate } from '@ngxs/router-plugin';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';
import { ContactsActions, ContactsSearchActions } from '../actions';
import { CreateContactPayload, SearchCriteria } from '../models';
import { ContactsService } from '../services';
import { TOAST_MESSAGES } from './toast-messages';

export interface ContactsSearchStateModel
  extends SearchStateModel<ContactSearch>,
    ModelWithLoadingStatus {}

@State<ContactsSearchStateModel>({
  name: 'contactsSearch',
  defaults: { criteria: new SearchCriteria() },
})
@Injectable()
export class ContactsSearchState {
  constructor(private readonly service: ContactsService) {}

  @Action(ContactsSearchActions.Activate)
  private activate(
    ctx: StateContext<ContactsSearchStateModel>,
    { contact }: ContactsActions.Activate
  ) {
    return this.service.setStatus(contact.Id, true).pipe(
      tap(() =>
        ctx.dispatch(new ToastActions.Show(TOAST_MESSAGES.CONTACT_ACTIVATED()))
      ),
      switchMap(() => this.waitForTheSearchIndexCompletion(ctx)),
      syncLoadProgress(ctx),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_UPDATED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsSearchActions.Create)
  private createContact(
    ctx: StateContext<ContactsSearchStateModel>,
    { payload }: ContactsSearchActions.Create
  ) {
    return this.service.create(payload).pipe(
      syncLoadProgress(ctx),
      tap((contact) => [
        ctx.dispatch(new Navigate(['/contacts', contact.Id])),
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_CREATED(contact))
        ),
      ]),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_CREATED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsSearchActions.Deactivate)
  private deactivate(
    ctx: StateContext<ContactsSearchStateModel>,
    { contact }: ContactsActions.Deactivate
  ) {
    return this.service.setStatus(contact.Id, false).pipe(
      tap(() =>
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_DEACTIVATED())
        )
      ),
      switchMap(() => this.waitForTheSearchIndexCompletion(ctx)),
      syncLoadProgress(ctx),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_UPDATED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsSearchActions.Delete)
  private delete(
    ctx: StateContext<ContactsSearchStateModel>,
    { contact }: ContactsSearchActions.Delete
  ) {
    return this.service.delete(contact.Id).pipe(
      tap(() =>
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_DELETED(contact.Name))
        )
      ),
      switchMap(() => this.waitForTheSearchIndexCompletion(ctx)),
      syncLoadProgress(ctx),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_DELETED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsSearchActions.Search)
  private search(
    ctx: StateContext<ContactsSearchStateModel>,
    { criteria }: ContactsSearchActions.Search
  ) {
    ctx.patchState({
      result: null,
      criteria,
    });

    return this.service.query<ContactSearch>(criteria).pipe(
      syncLoadProgress(ctx),
      tap((result) => ctx.patchState({ result }))
    );
  }

  @Action(ContactsSearchActions.TransferOwnership)
  private transferOwnership(
    ctx: StateContext<ContactsSearchStateModel>,
    { contact, newOwner }: ContactsSearchActions.TransferOwnership
  ) {
    return this.service.transferOwner(contact.Id, newOwner.Id).pipe(
      tap(() =>
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.CONTACT_TRANSFERRED(newOwner.Name)
          )
        )
      ),
      switchMap(() => this.waitForTheSearchIndexCompletion(ctx)),
      syncLoadProgress(ctx),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.CONTACT_NOT_TRANSFERRED(contact.Name)
          )
        );
        return EMPTY;
      })
    );
  }

  private waitForTheSearchIndexCompletion(
    ctx: StateContext<ContactsSearchStateModel>
  ) {
    // @TODO for now there is no mechanism for wait for the change, so wait 2.5 second, and make search request
    return of({}).pipe(
      delay(2500),
      tap(() =>
        ctx.dispatch([
          new ContactsSearchActions.Search(ctx.getState().criteria),
        ])
      )
    );
  }
}
