import { createSelectorX, TypedSelector } from '../../ngxs-utils';
import { OperationStatus } from './operation-status.model';

export function createOperationSelectorsFor(
  operationStatusProp: TypedSelector<OperationStatus | undefined>
) {
  return {
    isInProgress: createSelectorX(
      [operationStatusProp],
      function isInProgress(operation) {
        return operation?.inProgress || false;
      }
    ),
    hasSucceeded: createSelectorX(
      [operationStatusProp],
      function hasSucceeded(operation) {
        return operation?.success || false;
      }
    ),
    getError: createSelectorX(
      [operationStatusProp],
      function getError(operation) {
        return operation?.error || null;
      }
    ),
  };
}
