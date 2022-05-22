import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';

// !!!!! PLACEHOLDER COMPONENT ONLY !!!!!
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-pres-no-products-msg',
  template: `
    <div class="proj-pres__products--empty no-items w-full">
      <div class="text-center">
        <p class="body-style-14-shark">
          There are no products in this presentation. Add products by starting a
          search.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .no-items {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PresNoProductsMessageComponent {}

@NgModule({
  declarations: [PresNoProductsMessageComponent],
  imports: [CosButtonModule],
  exports: [PresNoProductsMessageComponent],
})
export class PresNoProductsMessageModule {}
