import { NgZone } from '@angular/core';
import { BasicFlowContext } from './basic-flow-context';
import { Observable } from 'rxjs';
import { DialogService } from '../services';
import { DialogDef } from '../utils';
import {
  DialogFlowStep,
  DialogFlowStepContext,
  StepInput,
  StepResult,
} from './models';

export class FullFlowContext {
  private basicFlowContext = new BasicFlowContext(
    this.dialogService,
    this.ngZone,
    {
      onReset: () => {
        this.stepContexts.forEach((step) => step.reset());
        this.config.onReset?.();
      },
      destroyed$: this.config.destroyed$,
    }
  );

  private stepContexts: DialogFlowStepContext[] = [];

  constructor(
    private readonly dialogService: DialogService,
    private readonly ngZone: NgZone,
    private readonly config: {
      destroyed$: Observable<void>;
      onReset?: () => void;
    }
  ) {}

  createStep<TDialogData extends StepInput, TResult extends StepResult>(
    definition: {
      dialog: DialogDef<TDialogData, TResult>;
      getInputData: (
        previousResult: Partial<TResult['data']>
      ) => TDialogData['input'];
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
  ): DialogFlowStepContext<TDialogData, TResult> {
    const stepDefinition: DialogFlowStep<TDialogData, TResult> =
      this.basicFlowContext.createStep(
        {
          dialog: definition.dialog as unknown as DialogDef<
            TDialogData,
            TResult
          >,
          getInputData: () =>
            definition.getInputData(
              stepResultMap.fullResult || stepResultMap.partialResult
            ),
          onNext: (result) => {
            stepResultMap.fullResult = result;
            definition.onNext(result);
          },
          onPrevious: (partialResult) => {
            stepResultMap.fullResult = null;
            stepResultMap.partialResult = partialResult;
            definition.onPrevious(partialResult);
          },
          canGoPrevious: definition.canGoPrevious?.bind?.(definition),
          canGoNext: definition.canGoNext?.bind?.(definition),
        },
        {
          markAsDirty: options?.markAsDirty?.bind?.(options),
          checkCanClose: options?.checkCanClose?.bind?.(options),
        }
      );
    const stepResultMap = {
      fullResult: null as TResult['data'] | null,
      partialResult: {} as Partial<TResult['data']>,
    };
    const context: DialogFlowStepContext<TDialogData, TResult> = {
      get stepDefinition() {
        return stepDefinition;
      },
      get result() {
        return stepResultMap.fullResult;
      },
      reset: () => {
        stepResultMap.fullResult = null;
        stepResultMap.partialResult = {};
      },
    };
    this.stepContexts.push(context);
    return context;
  }

  start(step: DialogFlowStepContext<StepInput, StepResult>): void {
    this.basicFlowContext.openStep(step.stepDefinition);
  }

  markAsDirty(dirty: boolean): void {
    this.basicFlowContext.markAsDirty(dirty);
  }

  complete(): void {
    this.basicFlowContext.complete();
  }

  reset(): void {
    this.basicFlowContext.reset();
  }

  openStep<
    // eslint-disable-next-line @typescript-eslint/ban-types
    TDialogData extends StepInput,
    TResult extends StepResult
  >(step: DialogFlowStepContext<TDialogData, TResult>): void {
    const dialogFlowStep = step.stepDefinition;
    this.basicFlowContext.openStep(dialogFlowStep);
  }

  checkCanClose(): Promise<boolean> {
    return this.basicFlowContext.checkCanClose();
  }

  confirmAbandonFlow(): Promise<boolean> {
    return this.basicFlowContext.confirmAbandonFlow();
  }
}
