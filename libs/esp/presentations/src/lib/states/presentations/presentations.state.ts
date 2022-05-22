import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Presentation } from '@esp/models';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';

import { PresentationsActions } from '../../actions';
import { PresentationsApiService } from '../../api/presentations-api.service';
import { PresentationsToastMessagesPresenter } from './presentations-toast-messages-presenter';

export interface PresentationsStateModel extends ModelWithLoadingStatus {
  presentation: Presentation | null;
}

type ThisStateContext = StateContext<PresentationsStateModel>;

const resetState = (): PresentationsStateModel => ({
  presentation: null,
});

@State<PresentationsStateModel>({
  name: 'presentations',
  defaults: resetState(),
})
@Injectable()
export class PresentationsState {
  constructor(
    private readonly service: PresentationsApiService,
    private readonly presentationsToastMessagesPresenter: PresentationsToastMessagesPresenter
  ) {}

  @Action(PresentationsActions.Create)
  createPresentation(
    ctx: ThisStateContext,
    action: PresentationsActions.Create
  ) {
    return this.service
      .create(<Presentation>{
        ProjectId: action.projectId,
        Products: action.productIds.map((ProductId) => ({ ProductId })),
      })
      .pipe(
        tap((presentation) => ctx.patchState({ presentation })),
        syncLoadProgress(ctx)
      );
  }

  @Action(PresentationsActions.Get)
  getPresentation(ctx: ThisStateContext, action: PresentationsActions.Get) {
    return this.service.get(action.presentationId).pipe(
      tap((presentation) => ctx.patchState({ presentation })),
      syncLoadProgress(ctx)
    );
  }

  // Temporary
  @Action(PresentationsActions.UpdatePresentationStatus)
  updatePresentationStatus(
    ctx: ThisStateContext,
    { status }: PresentationsActions.UpdatePresentationStatus
  ) {
    const { presentation } = ctx.getState();
    const updatedPresentation = {
      ...presentation,
      ...{ Status: status },
    } as Presentation;
    ctx.patchState({
      presentation: updatedPresentation,
    });
  }

  @Action(PresentationsActions.Update)
  update(ctx: ThisStateContext, { presentation }: PresentationsActions.Update) {
    return this.service
      .update(presentation)
      .pipe(tap((presentation) => ctx.patchState({ presentation })));
  }

  @Action(PresentationsActions.AddProducts)
  addProducts(ctx: ThisStateContext, action: PresentationsActions.AddProducts) {
    return this.service
      .addProducts(action.presentationId, action.productIds)
      .pipe(
        tap((response) => {
          ctx.patchState({ presentation: response.Presentation });
          this.presentationsToastMessagesPresenter.addProductsSucceeded(
            response,
            action.projectName
          );
        }),
        catchError(() => {
          this.presentationsToastMessagesPresenter.addProductsFailed(
            action.productIds
          );
          return EMPTY;
        }),
        syncLoadProgress(ctx)
      );
  }

  @Action(PresentationsActions.RemoveProduct)
  removeProduct(
    ctx: ThisStateContext,
    { presentationId, productId }: PresentationsActions.RemoveProduct
  ) {
    return this.service.removeProduct(presentationId, productId).pipe(
      tap((presentation) => {
        ctx.patchState({ presentation });
      }),
      catchError(() => {
        this.presentationsToastMessagesPresenter.productsNotDeleted();
        return EMPTY;
      })
    );
  }

  @Action(PresentationsActions.SequenceProducts)
  sequenceProducts(
    ctx: ThisStateContext,
    { presentationId, sequence }: PresentationsActions.SequenceProducts
  ) {
    return this.service.sequenceProducts(presentationId, sequence).pipe(
      catchError((presentation) => {
        this.presentationsToastMessagesPresenter.productsNotSorted();

        ctx.patchState({ presentation });

        return EMPTY;
      })
    );
  }

  @Action(PresentationsActions.SortProducts)
  sortProducts(
    ctx: ThisStateContext,
    { presentationId, sortOrder }: PresentationsActions.SortProducts
  ) {
    return this.service.sortProducts(presentationId, sortOrder).pipe(
      tap((presentation) => ctx.patchState({ presentation })),
      catchError(() => {
        this.presentationsToastMessagesPresenter.productsNotSorted();
        return EMPTY;
      })
    );
  }

  @Action(PresentationsActions.UpdatePresentationProductVisibility)
  updatePresentationProductVisibility(
    ctx: ThisStateContext,
    action: PresentationsActions.UpdatePresentationProductVisibility
  ) {
    // We have visible and hidden products on the UI, and we want to find the product by `action.productId`
    // within `presentation.Products` and update its `IsVisible` property.
    ctx.setState(
      patch<PresentationsStateModel>({
        presentation: patch<PresentationsStateModel['presentation']>({
          Products: updateItem(
            (product) => product!.Id === action.productId,
            patch({
              IsVisible: action.isVisible,
            })
          ),
        }),
      })
    );
  }
}
