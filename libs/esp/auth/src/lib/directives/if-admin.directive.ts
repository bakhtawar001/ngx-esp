import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthFacade } from '../services';

@Directive({
  selector: '[ifAdmin]',
})
export class IfAdminDirective {
  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private _authFacade: AuthFacade
  ) {}

  apply(condition: boolean) {
    if (this._authFacade.user.hasRole('admin')) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }
}
