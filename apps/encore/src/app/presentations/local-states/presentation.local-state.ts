import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import { PresentationsActions, PresentationsQueries } from '@esp/presentations';
import { ProjectQueries } from '@esp/projects';

@Injectable()
export class PresentationLocalState extends LocalState<PresentationLocalState> {
  updateStatus = asDispatch(PresentationsActions.UpdatePresentationStatus);
  save = asDispatch(PresentationsActions.Update);

  isLoading = fromSelector(PresentationsQueries.isLoading);
  hasLoaded = fromSelector(PresentationsQueries.hasLoaded);

  project = fromSelector(ProjectQueries.getProject);
  presentation = fromSelector(PresentationsQueries.getPresentation);

  visibleProducts = fromSelector(PresentationsQueries.getVisibleProducts);
  hiddenProducts = fromSelector(PresentationsQueries.getHiddenProducts);
}
