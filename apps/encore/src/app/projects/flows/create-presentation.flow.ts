import { ChangeDetectorRef, Injectable } from '@angular/core';

import { defaultProjectDetailsFormValue } from '@esp/projects';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductSearchResultItem } from '@smartlink/models';

import { selectCustomerDialogConfig } from '../../companies/dialogs';
import { projectCreateInProgressDialogDef } from '../dialogs/project-create-in-progress/project-create-in-progress.config';
import { projectCreateWithNewCustomerInProgressDialogDef } from '../dialogs/project-create-with-new-customer-in-progress/project-create-with-new-customer-in-progress.config';
import { projectCreateWithNewCustomerConfig } from '../dialogs/project-create-with-new-customer/project-create-with-new-customer.config';
import { projectDetailsCreateDialogDef } from '../dialogs/project-details-create/project-details-create.config';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { BaseFlow, DialogFlowFactoryService, raf$ } from '@cosmos/core';
import { PresentationsActions } from '@esp/presentations';
import { switchMap } from 'rxjs/operators';

@UntilDestroy()
@Injectable()
export class CreatePresentationFlow extends BaseFlow {
  private customerSelection = this.flow.createStep({
    dialog: selectCustomerDialogConfig,
    getInputData: (previousResult) => ({
      searchTerm: previousResult?.searchTerm || '',
      selectedCustomerId: previousResult?.selectedCustomerId || null,
    }),
    canGoPrevious: () => true,
    onNext: (result) => {
      if (result.createNew) {
        this.flow.openStep(this.projectCreateWithNewCustomer);
      } else {
        this.flow.markAsDirty(true);
        this.flow.openStep(this.projectDetailsCreate);
      }
    },
    onPrevious: () => {
      this.flow.complete();
    },
  });

  private projectDetailsCreate = this.flow.createStep({
    dialog: projectDetailsCreateDialogDef,
    getInputData: (previousResult) => ({
      ...defaultProjectDetailsFormValue,
      ...(previousResult || {}),
    }),
    onNext: () => {
      this.flow.openStep(this.projectCreateInProgress);
    },
    onPrevious: () => {
      this.flow.openStep(this.customerSelection);
    },
  });

  private projectCreateWithNewCustomer = this.flow.createStep({
    dialog: projectCreateWithNewCustomerConfig,
    getInputData: (previousResult) => ({
      project: {
        ...defaultProjectDetailsFormValue,
        ...previousResult.project,
      },
      customer: {
        ...previousResult.customer,
      },
      productIds: [],
    }),
    onNext: () => {
      this.flow.openStep(this.projectCreateWithNewCustomerInProgress);
    },
    onPrevious: () => {
      this.flow.openStep(this.customerSelection);
    },
  });

  private projectCreateWithNewCustomerInProgress = this.flow.createStep({
    dialog: projectCreateWithNewCustomerInProgressDialogDef,
    getInputData: () => ({
      customer: this.projectCreateWithNewCustomer.result.customer,
      project: this.projectCreateWithNewCustomer.result.project,
      productIds: [],
    }),
    onNext: () => {
      this.flow.complete();
    },
    onPrevious: () => {
      this.flow.openStep(this.projectCreateWithNewCustomer);
    },
  });

  private projectCreateInProgress = this.flow.createStep({
    dialog: projectCreateInProgressDialogDef,
    getInputData: () => ({
      project: {
        ...this.projectDetailsCreate.result,
        Customer: {
          Id: this.customerSelection.result.selectedCustomerId,
        },
        Budget: Number(
          this.projectDetailsCreate.result.Budget.replace(/,/g, '')
        ),
        NumberOfAssignees: Number(
          this.projectDetailsCreate.result.NumberOfAssignees.replace(/,/g, '')
        ),
      },
      productIds: [],
    }),
    onNext: () => {
      this.flow.complete();
    },
    onPrevious: () => {
      this.flow.openStep(this.projectDetailsCreate);
    },
  });

  constructor(
    dialogFlowService: DialogFlowFactoryService,
    private actions$: Actions
  ) {
    super(dialogFlowService);
  }

  start() {
    this.flow.start(this.customerSelection);
  }

  setupCleanUpCheckedProductsListener(
    ref: ChangeDetectorRef,
    checkedProducts: Map<number, ProductSearchResultItem>
  ): void {
    this.actions$
      .pipe(
        ofActionDispatched(PresentationsActions.AddProducts),
        switchMap(() => {
          checkedProducts.clear();
          return raf$;
        }),
        untilDestroyed(this)
      )
      .subscribe(() => {
        ref.detectChanges();
      });
  }
}
