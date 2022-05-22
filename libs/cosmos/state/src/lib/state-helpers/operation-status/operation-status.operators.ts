import { patch } from '@ngxs/store/operators';
import { StateOperator } from '../../local-state';
import { ifNull, safePatch } from '../../ngxs-utils';
import { ErrorResult, OperationStatus } from './operation-status.model';

export function setOperationInProgress(): StateOperator<OperationStatus> {
  return safePatch<OperationStatus>({
    success: false,
    inProgress: true,
    error: null,
  });
}

// export function setOperationInProgress() {
//   return ifNull<OperationStatus>(
//     {
//       success: false,
//       inProgress: true,
//       error: null,
//     },
//     patch<OperationStatus>({ inProgress: true })
//   );
// }

export function setOperationSuccess() {
  return safePatch<OperationStatus>({
    success: true,
    inProgress: false,
    error: null,
  });
}

export function setOperationCancelled() {
  return ifNull<OperationStatus>(
    {
      success: false,
      inProgress: false,
      error: null,
    },
    patch<OperationStatus>({ inProgress: false })
  );
}

// export function setOperationCancelled() {
//   return safePatch<OperationStatus>({
//     success: false,
//     inProgress: false,
//     error: null,
//   });
// }

export function setOperationError(error: ErrorResult) {
  return safePatch<OperationStatus>({
    success: false,
    inProgress: false,
    error: error,
  });
}
