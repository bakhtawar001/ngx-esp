import { MatDialogConfig } from '@angular/material/dialog';
import { DialogDef } from '../utils';

export type StepResult<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TActions = 'previous' | 'next'
> = {
  data: TData;
  action: TActions;
};

export type StepInput<TInputData = unknown> = {
  input: TInputData;
  step: {
    canGoPrevious(): boolean;
    canGoNext(): boolean;
    markAsDirty(isDirty: boolean): void;
    checkCanClose(): Promise<boolean>;
  };
};

export interface DialogFlowStep<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TDialogData extends StepInput,
  TResult extends StepResult
> {
  dialog: DialogDef<TDialogData, TResult>;
  dialogConfig?: MatDialogConfig<TDialogData>;
  step: {
    getDialogData(): TDialogData;
    onNext(result: TResult['data']): void;
    onPrevious(partialResult: Partial<TResult['data']>): void;
  };
}

export interface DialogFlowStepContext<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TDialogData extends StepInput = StepInput,
  TResult extends StepResult = StepResult
> {
  readonly stepDefinition: DialogFlowStep<TDialogData, TResult>;
  readonly result: TResult['data'] | null;
  reset(): void;
}
