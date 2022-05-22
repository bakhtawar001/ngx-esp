import { ChangeDetectorRef, Injectable } from '@angular/core';

import { defaultProjectDetailsFormValue } from '@esp/projects';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductSearchResultItem } from '@smartlink/models';

import { selectCustomerDialogConfig } from '../../companies/dialogs';
import { presentationSelectDialogDef } from '../../presentations/dialogs/presentation-select/presentation-select.config';
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
export class AddToPresentationFlow extends BaseFlow {
  private checkedProducts = new Map<number, ProductSearchResultItem>();

  // Caretaker note: this is the default subheader so we don't duplicate it between different modules,
  // it might be overridden when calling `start()`.
  private subheader =
    'Create a new project and add these products to a new presentation or select an existing project and add these products to the existing presentation.';

  private get productIds(): number[] {
    return Array.from(this.checkedProducts.keys());
  }

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
      this.flow.openStep(this.presentationSelection());
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
      productIds: this.productIds,
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
      productIds: this.productIds,
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
      productIds: this.productIds,
    }),
    onNext: () => {
      this.flow.complete();
    },
    onPrevious: () => {
      this.flow.openStep(this.projectDetailsCreate);
    },
  });

  private presentationSelection = () =>
    this.flow.createStep({
      dialog: presentationSelectDialogDef,
      getInputData: () => ({
        subheader: this.subheader,
        checkedProducts: this.checkedProducts,
      }),
      onNext: (result) => {
        if (result.createNew) {
          this.flow.openStep(this.customerSelection);
        }
        if (result.complete) {
          this.flow.complete();
        }
      },
      onPrevious: () => {
        this.flow.complete();
      },
    });

  constructor(
    dialogFlowService: DialogFlowFactoryService,
    private actions$: Actions
  ) {
    super(dialogFlowService);
  }

  start(options?: {
    subheader?: string;
    checkedProducts: Map<number, ProductSearchResultItem>;
  }) {
    this.subheader = options?.subheader || this.subheader;
    this.checkedProducts = options?.checkedProducts
      ? new Map(options.checkedProducts)
      : this.checkedProducts;
    this.flow.start(this.presentationSelection());
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
