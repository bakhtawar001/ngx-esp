import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injectable,
  NgModule,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';

import { Presentation } from '@esp/models';
import {
  ToastActions,
  TOAST_COMPONENT_DATA,
} from '@cosmos/components/notification';
import { CosButtonModule } from '@cosmos/components/button';

import { AddProductsResponse } from '../../api';

interface ProductsAddedData {
  projectId: string;
  presentationId: string;
}

@Component({
  template: `<a
    cos-button
    class="pl-0"
    routerLink="/projects/{{ data.projectId }}/presentations/{{
      data.presentationId
    }}"
    >Configure Products</a
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureProductsButtonComponent {
  constructor(@Inject(TOAST_COMPONENT_DATA) public data: ProductsAddedData) {}
}

@NgModule({
  imports: [RouterModule, CosButtonModule],
  declarations: [ConfigureProductsButtonComponent],
})
export class ConfigureProductsButtonModule {}

@Injectable({ providedIn: 'root' })
export class PresentationsToastMessagesPresenter {
  private readonly maxProductsPerPresentation = 250;

  private readonly duration = 8e3; // 8 seconds.

  constructor(private readonly store: Store) {}

  productsAdded(
    presentation: Presentation,
    projectName: string,
    productIds: number[]
  ): void {
    this.store.dispatch(
      new ToastActions.Show(
        {
          title: 'Success!',
          body: `${productIds.length} products added to ${projectName}`,
          type: 'confirm',
          component: ConfigureProductsButtonComponent,
          componentData: {
            presentationId: presentation.Id,
            projectId: presentation.ProjectId,
          },
        },
        { duration: this.duration }
      )
    );
  }

  addProductsSucceeded(
    response: AddProductsResponse,
    projectName: string
  ): void {
    if (response.ProductsAdded.length > 0) {
      this.productsAdded(
        response.Presentation,
        projectName,
        response.ProductsAdded
      );
    }

    if (response.ProductsDuplicated.length > 0) {
      this.store.dispatch(
        new ToastActions.Show(
          {
            title: 'Error: Products not added!',
            body: `${response.ProductsDuplicated.length} product(s) already exist in ${projectName}!`,
            type: 'error',
          },
          { duration: this.duration }
        )
      );
    }

    if (response.ProductsTruncated.length > 0) {
      this.store.dispatch(
        new ToastActions.Show(
          {
            title: 'Error: Too many products',
            body: `${response.ProductsTruncated.length} product(s) were unable to be added. ${this.maxProductsPerPresentation} product per presentation limit reached.`,
            type: 'error',
          },
          { duration: this.duration }
        )
      );
    }
  }

  addProductsFailed(productIds: number[]): void {
    this.store.dispatch(
      new ToastActions.Show({
        title: 'Error!',
        body: `${productIds.length} product(s) failed to add, please try again.`,
        type: 'error',
      })
    );
  }

  productsNotDeleted(): void {
    this.store.dispatch(
      new ToastActions.Show({
        title: 'Error!',
        body: 'Product failed to delete.',
        type: 'error',
      })
    );
  }

  productsNotSorted(): void {
    this.store.dispatch(
      new ToastActions.Show({
        title: 'Error!',
        body: 'Product failed to reorder.',
        type: 'error',
      })
    );
  }
}
