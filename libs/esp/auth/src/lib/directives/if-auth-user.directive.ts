import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthFacade } from '../services';

@UntilDestroy()
@Directive({
  selector: '[ifAuthUser]',
})
export class IfAuthUserDirective {
  private hasView = false;
  private providedUserId$ = new Subject<number>();

  @Input('ifAuthUser')
  set providedUserId(userId: number) {
    this.providedUserId$.next(userId);
  }

  constructor(
    private readonly _authFacade: AuthFacade,
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef
  ) {
    const user$ = this._authFacade.getUser();

    combineLatest([user$, this.providedUserId$])
      .pipe(
        untilDestroyed(this),
        tap(([user, providedUserId]) =>
          this.apply(user && user.Id === providedUserId)
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.hasView = false;
  }

  apply(condition: boolean) {
    if (condition) {
      if (!this.hasView)
        this._viewContainer.createEmbeddedView(this._templateRef);
      this.hasView = true;
    } else {
      this.hasView = false;
      this._viewContainer.clear();
    }
  }
}
