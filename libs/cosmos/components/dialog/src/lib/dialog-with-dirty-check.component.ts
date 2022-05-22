import { AfterViewInit, Directive } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom, fromEvent, Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@UntilDestroy()
@Directive()
export abstract class DialogWithDirtyCheck<T> implements AfterViewInit {
  protected abstract confirmLeave(): Observable<boolean>;

  protected abstract isDirty(): boolean;

  protected constructor(protected readonly dialogRef: MatDialogRef<T>) {}

  async onClose(): Promise<void> {
    if (!this.isDirty()) {
      this.dialogRef.close();
      return;
    }

    firstValueFrom(this.confirmLeave()).then((shouldClose) => {
      if (shouldClose) {
        this.dialogRef.close();
      }
    });
  }

  ngAfterViewInit(): void {
    this.listenToBackdropClick();
    this.listenToUnload();
  }

  private listenToBackdropClick(): void {
    this.dialogRef
      .backdropClick()
      .pipe(
        switchMap(() => (this.isDirty() ? this.confirmLeave() : of(true))),
        filter(Boolean),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  private listenToUnload(): void {
    fromEvent(window, 'beforeunload')
      .pipe(
        filter(() => this.isDirty()),
        untilDestroyed(this)
      )
      .subscribe((event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = '';
      });
  }
}
