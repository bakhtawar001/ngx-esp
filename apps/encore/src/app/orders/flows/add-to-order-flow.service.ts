import { Injectable } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { selectOrderDialogConfig } from '../dialogs/select-order';

import { BaseFlow, DialogFlowFactoryService } from '@cosmos/core';

@UntilDestroy()
@Injectable()
export class AddToOrderFlow extends BaseFlow {
  private orderSelection = this.flow.createStep({
    dialog: selectOrderDialogConfig,
    getInputData: (previousResult) => ({
      searchTerm: previousResult?.searchTerm || '',
      selectedOrderId: previousResult?.selectedOrderId || null,
    }),
    canGoPrevious: () => true,
    onNext: (result) => {
      this.flow.complete();
    },
    onPrevious: () => {
      this.flow.complete();
    },
  });

  constructor(dialogFlowService: DialogFlowFactoryService) {
    super(dialogFlowService);
  }

  start() {
    this.flow.start(this.orderSelection);
  }
}
