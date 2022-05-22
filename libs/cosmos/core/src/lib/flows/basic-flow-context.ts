import { NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, fromEvent, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DialogService } from '../services';
import { DialogDef } from '../utils';
import { confirmDiscardFlowDialogDef } from './confirm-discard-flow.config';
import { DialogFlowStep, StepInput, StepResult } from './models';

export class BasicFlowContext {
  private hasData = false;
  private currentDialogRefs: MatDialogRef<unknown, unknown>[] = [];

  constructor(
    private readonly dialogService: DialogService,
    private ngZone: NgZone,
    private config: {
      onReset: () => void;
      destroyed$: Observable<void>;
    }
  ) {
    this.listenToUnloadEvent();
  }

  createStep<TDialogData extends StepInput, TResult extends StepResult>(
    definition: {
      dialog: DialogDef<TDialogData, TResult>;
      getInputData: () => TDialogData['input'];
      onNext(result: TResult['data']): void;
      onPrevious(partialResult: Partial<TResult['data']>): void;
      /** Should the step have the ability to go back (default: true) */
      canGoPrevious?: () => boolean;
      /** Should the step have the ability to go forward (default: true) */
      canGoNext?: () => boolean;
    },
    options?: {
      markAsDirty?(isDirty: boolean): void;
      checkCanClose?(): Promise<boolean>;
    }
  ): DialogFlowStep<TDialogData, TResult> {
    return {
      dialog: definition.dialog,
      step: {
        getDialogData: () =>
          ({
            input: definition.getInputData(),
            step: {
              canGoPrevious: () =>
                definition.canGoPrevious ? definition.canGoPrevious() : true,
              canGoNext: () =>
                definition.canGoNext ? definition.canGoNext() : true,
              markAsDirty: (isDirty) => {
                options?.markAsDirty?.(isDirty);
                this.markAsDirty(isDirty);
              },
              checkCanClose: async () => {
                const stepCanClose = options?.checkCanClose
                  ? await options.checkCanClose()
                  : true;
                const flowCanClose =
                  stepCanClose && (await this.checkCanClose());
                return stepCanClose && flowCanClose;
              },
            },
          } as TDialogData),
        onNext: (result) => definition.onNext(result),
        onPrevious: (partialResult) => definition.onPrevious(partialResult),
      },
    };
  }

  start(dialogFlowStep: DialogFlowStep<StepInput, StepResult>): void {
    this.reset();
    this.openStep(dialogFlowStep);
  }

  markAsDirty(dirty: boolean): void {
    this.hasData = this.hasData || dirty;
  }

  complete(): void {
    this.reset();
  }

  reset(): void {
    this.hasData = false;
    this.config.onReset();
  }

  openStep<
    // eslint-disable-next-line @typescript-eslint/ban-types
    TDialogData extends StepInput,
    TResult extends StepResult
  >(dialogFlowStep: DialogFlowStep<TDialogData, TResult>): void {
    const stepInputData = dialogFlowStep.step.getDialogData();
    this.dialogService
      .open(dialogFlowStep.dialog, stepInputData, {
        config: dialogFlowStep.dialogConfig,
        dialogRefHook: (dialogRef) => {
          this.trackDialogRef(dialogRef);
          this.listenToBackdropClick(dialogRef);
        },
      })
      // The user might click on the backdrop and the `result` will be `undefined`.
      .pipe(filter(Boolean))
      .subscribe((result) => {
        const data: TResult['data'] = result.data;
        switch (result.action) {
          case 'next':
            dialogFlowStep.step.onNext(data);
            break;
          case 'previous':
            dialogFlowStep.step.onPrevious(data);
            break;
        }
      });
  }

  async checkCanClose(): Promise<boolean> {
    if (this.hasData) {
      return !!(await firstValueFrom(
        this.dialogService.open(confirmDiscardFlowDialogDef)
      ));
    } else {
      return true;
    }
  }

  async confirmAbandonFlow(): Promise<boolean> {
    const canClose = await this.checkCanClose();
    if (canClose) {
      this.flowAbandoned();
    }
    return canClose;
  }

  private trackDialogRef(dialogRef: MatDialogRef<unknown, unknown>): void {
    this.currentDialogRefs.push(dialogRef);
    dialogRef.afterClosed().subscribe(() => {
      this.currentDialogRefs = this.currentDialogRefs.filter(
        (item) => item !== dialogRef
      );
    });
  }

  private flowAbandoned(): void {
    this.currentDialogRefs.forEach((ref) => {
      ref.close();
    });
    this.reset();
  }

  private listenToBackdropClick(
    dialogRef: MatDialogRef<unknown, unknown>
  ): void {
    dialogRef
      .backdropClick()
      .pipe(
        takeUntil(dialogRef.afterClosed()),
        takeUntil(this.config.destroyed$)
      )
      .subscribe(() => {
        this.confirmAbandonFlow();
      });
  }

  private listenToUnloadEvent(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'beforeunload')
        .pipe(
          filter(() => this.hasData),
          takeUntil(this.config.destroyed$)
        )
        .subscribe((event: BeforeUnloadEvent) => {
          event.preventDefault();
          event.returnValue = '';
          this.confirmAbandonFlow().then((canClose) => {
            if (canClose) {
              window.close();
            }
          });
        });
    });
  }
}
