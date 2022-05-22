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
import type { Contact } from '@esp/models';
import { Navigate } from '@ngxs/router-plugin';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';
import { ContactsActions, ContactsSearchActions } from '../actions';
import { ContactsService } from '../services';
import { ContactsSearchStateModel } from './contacts-search.state';
import { TOAST_MESSAGES } from './toast-messages';

const ACCEPTABLE_CACHE_SIZE = 5 as const;

export interface ContactsStateModel
  extends ModelWithLoadingStatus,
    EntityStateModel<Contact> {}

type LocalStateContext = StateContext<ContactsStateModel>;

const defaultState = (): ContactsStateModel => ({
  loading: getDefaultOperationStatus(),
  items: {},
  itemIds: [],
});

@State<ContactsStateModel>({
  name: 'contacts',
  defaults: defaultState(),
})
@Injectable()
export class ContactsState {
  constructor(private readonly _service: ContactsService) {}

  @Action(ContactsActions.Activate)
  private activate(
    ctx: LocalStateContext,
    { contact }: ContactsActions.Activate
  ) {
    return this._service.setStatus(contact.Id, true).pipe(
      tap(() => {
        ctx.setState(
          setEntityStateItem(
            contact.Id,
            { ...contact, IsActive: true },
            { cacheSize: ACCEPTABLE_CACHE_SIZE }
          )
        );
      }),
      tap(() =>
        ctx.dispatch(new ToastActions.Show(TOAST_MESSAGES.CONTACT_ACTIVATED()))
      ),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_UPDATED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsActions.Deactivate)
  private deactivate(
    ctx: LocalStateContext,
    { contact }: ContactsActions.Deactivate
  ) {
    return this._service.setStatus(contact.Id, false).pipe(
      tap(() => {
        ctx.setState(
          setEntityStateItem(
            contact.Id,
            { ...contact, IsActive: false },
            { cacheSize: ACCEPTABLE_CACHE_SIZE }
          )
        );
      }),
      tap(() =>
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_DEACTIVATED())
        )
      ),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_UPDATED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsActions.Delete)
  private delete(ctx: LocalStateContext, { contact }: ContactsActions.Delete) {
    return this._service.delete(contact.Id).pipe(
      delay(2500), // wait for search result to update
      tap(() => {
        ctx.dispatch([
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_DELETED(contact.Name)),
          new Navigate(['/directory/contacts']),
        ]);
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_DELETED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsActions.Get)
  private getContact(ctx: LocalStateContext, { id }: ContactsActions.Get) {
    ctx.patchState({ currentId: id });

    return this._service.get(id).pipe(
      syncLoadProgress(ctx),
      tap((contact) =>
        ctx.setState(
          setEntityStateItem(id, contact, { cacheSize: ACCEPTABLE_CACHE_SIZE })
        )
      )
    );
  }

  @Action(ContactsActions.Patch)
  private patchContact(
    ctx: LocalStateContext,
    { payload }: ContactsActions.Patch
  ) {
    const state = ctx.getState();
    const contact = state.items[state.currentId];
    const updatedContact = {
      ...contact,
      ...payload,
      Name: `${payload.GivenName || contact?.GivenName} ${
        payload.FamilyName || contact?.FamilyName
      }`,
    } as Contact;

    return this._service.save(updatedContact).pipe(
      optimisticUpdate<Contact>(updatedContact, {
        getValue: () => ctx.getState().items[payload.Id],
        setValue: () =>
          ctx.setState(setEntityStateItem(updatedContact.Id, updatedContact)),
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.CONTACT_NOT_UPDATED())
        );
        return EMPTY;
      })
    );
  }

  @Action(ContactsActions.TransferOwnership)
  private transferOwnership(
    ctx: LocalStateContext,
    { contact, newOwner }: ContactsActions.TransferOwnership
  ) {
    return this._service.transferOwner(contact.Id, newOwner.Id).pipe(
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
          new Navigate(['/directory/contacts']),
          new ContactsSearchActions.Search(),
        ])
      )
    );
  }
}
