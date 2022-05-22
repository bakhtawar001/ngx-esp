import { StateOperator } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { PatchSpec } from '@ngxs/store/operators/patch';
import {
  ErrorResult,
  OperationStatus,
  setOperationCancelled,
  setOperationError,
  setOperationInProgress,
  setOperationSuccess,
} from '../operation-status';

export type ModelWithLoadingStatus = {
  loading?: OperationStatus;
};

function patchLoadingProp<T extends ModelWithLoadingStatus>(
  loadingPropOperator: StateOperator<T['loading']>,
  modelPatch?: Omit<PatchSpec<T>, 'loading'>
) {
  modelPatch = modelPatch || ({} as PatchSpec<T>);
  // @ts-ignore TODO: Mark, please, fix errors here...
  const patchSpec: PatchSpec<T> = {
    ...(modelPatch || ({} as PatchSpec<T>)),
    loading: setOperationSuccess(),
  };
  return patch<T>(patchSpec);
}

export function loadInProgress() {
  // @ts-ignore TODO: Mark, please, fix errors here...
  return patchLoadingProp(setOperationInProgress());
}

export function loadSuccess<T extends ModelWithLoadingStatus>(
  resultPatch?: Omit<PatchSpec<T>, 'loading'>
) {
  // @ts-ignore TODO: Mark, please, fix errors here...
  return patchLoadingProp(setOperationSuccess(), resultPatch);
}

export function loadCancelled<T extends ModelWithLoadingStatus>(
  resultPatch?: Omit<PatchSpec<T>, 'loading'>
) {
  // @ts-ignore TODO: Mark, please, fix errors here...
  return patchLoadingProp(setOperationCancelled(), resultPatch);
}

export function loadFailure<T extends ModelWithLoadingStatus>(
  error: ErrorResult,
  resultPatch?: Omit<PatchSpec<T>, 'loading'>
) {
  // @ts-ignore TODO: Mark, please, fix errors here...
  return patchLoadingProp(setOperationError(error), resultPatch);
}
