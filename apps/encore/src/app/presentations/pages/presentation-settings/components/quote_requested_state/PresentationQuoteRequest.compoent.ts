import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';

// !!!!! PLACEHOLDER COMPONENT ONLY !!!!!
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-pres-quote-request',
  template: `
    <div class="proj-quote-request mb-16">
      <div class="flex justify-between align-center mb-16">
        <h2 class="header-style-22 mb-0">Quote Request Received</h2>
        <button cos-flat-button color="primary">
          <i class="fa fa-file-invoice-dollar mr-8"></i>
          Create Quote
        </button>
      </div>
      <cos-card class="proj-quote-request-product mb-16">
        <h2 class="header-style-16">Adult Softspun Semi-Fitted Tee</h2>
        <div class="proj-quote-request-product-body">
          <div class="proj-quote-request-product-col1">
            <img
              src="https://api.uat-asicentral.com/v1/media/34595301?size=medium"
              alt=""
            />
            <ul class="cos-list-no-style">
              <li>Color: Basic White</li>
              <li>Size: S: 50, M: 100, L: 100, XL: 30</li>
              <li>Quantity: 280</li>
              <li>Imprint Method: Screenprint</li>
              <li>Artwork: <a href="#">cityofpawnee_fullcolor.png</a></li>
            </ul>
          </div>
          <div class="proj-quote-request-product-col2">
            <div class="proj-quote-request-product-comments">
              <span>Customization comments:</span>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                sagittis tortor a nisi mattis luctus. Pellentesque non mauris in
                diam molestie commodo vel sit amet dui. Nulla pretium nec nulla
                vel congue.
              </p>
            </div>
          </div>
        </div>
      </cos-card>
      <cos-card class="proj-quote-request-product mb-16">
        <h2 class="header-style-16">Stadium Cup - 32oz.</h2>
        <div class="proj-quote-request-product-body">
          <div class="proj-quote-request-product-col1">
            <img
              src="https://api.uat-asicentral.com/v1/media/37803527?size=medium"
              alt=""
            />
            <ul class="cos-list-no-style">
              <li>Color: Teal</li>

              <li>Quantity: 1000</li>
              <li>Imprint Method: Screenprint</li>
              <li>Artwork: <a href="#">cityofpawnee_white.png</a></li>
            </ul>
          </div>
        </div>
      </cos-card>
      <cos-card class="proj-quote-request-product mb-16">
        <h2 class="header-style-16">Large Cotton Canvas Sailing Tote Bag</h2>
        <div class="proj-quote-request-product-body">
          <div class="proj-quote-request-product-col1">
            <img
              src="https://api.uat-asicentral.com/v1/media/33809933?size=medium"
              alt=""
            />
            <ul class="cos-list-no-style">
              <li>Color: Blue</li>

              <li>Quantity: 1000</li>
              <li>Imprint Method: Screenprint</li>
              <li>Artwork: <a href="#">cityofpawnee_navy.png</a></li>
            </ul>
          </div>
        </div>
      </cos-card>
      <cos-card class="proj-quote-request-order-details mb-16">
        <h2 class="header-style-16">Large Cotton Canvas Sailing Tote Bag</h2>
        <p cosAttributeTag size="small">
          <i class="fa fa-sync"></i> Changes automatically updated in project
          details
        </p>
        <div
          class="lg:grid-cols-4-auto grid-cols-1-auto grid-gap-16 grid mt-16"
        >
          <div class="proj-quote-request-address">
            <span class="header-style-12-shark">Point of Contact</span>
            Elizabeth Wiley <br />ewiley@greenstonefinancial.com
            <br />321-555-1234
          </div>
          <div class="proj-quote-request-address">
            <span class="header-style-12-shark">Billing Address</span>
            Elizabeth Wiley <br />
            1650 Market St, Ste 1902 <br />
            Philadelphia, PA 19103 <br />
            United States
          </div>
          <div class="proj-quote-request-address">
            <span class="header-style-12-shark">Shipping Address</span>
            Elizabeth Wiley <br />
            1650 Market St, Ste 1902 <br />
            Philadelphia, PA 19103 <br />
            United States
          </div>
          <div class="proj-quote-request-address">
            <span class="header-style-12-shark">Project Details</span>
            Needed in-hands by November 13, 2020 <br />Event scheduled for
            November 20, 2020
          </div>
        </div>
      </cos-card>
      <cos-card class="mb-16">
        <h2 class="header-style-16">Customer Message</h2>
        <cos-card class="bg-grey mb-16">
          <div class="proj-quote-request-customer-message">
            <div class="mr-16">
              <cos-avatar>
                <img src="https://via.placeholder.com/32" alt="" />
              </cos-avatar>
            </div>
            <div class="proj-quote-request-customer-message-body">
              <div class="flex justify-between">
                <h2 class="header-style-14-bold mb-8">Leslie Knope</h2>
                <span class="body-style-11"
                  >Sent November 25, 2020 at 10:17 am</span
                >
              </div>
              <p class="body-style-14-shark">
                Please ensure that our historic logo is printed in official City
                of Pawnee colors. We also need artwork for the shirt. Thanks!
              </p>
            </div>
          </div>
        </cos-card>

        <h2 class="header-style-16 mb-8">Attachment (1)</h2>
        <cos-card class="proj-quote-request-preview mb-8">
          <div class="proj-quote-request-preview-icon">
            <i class="fa fa-save"></i>
          </div>

          <img src="https://via.placeholder.com/94" alt="" />
        </cos-card>
        <p class="body-style-11 mb-4">cityofpawnee_fullcolor.eps</p>
        <p class="body-style-11 mb-4">Size: 29 KB</p>
      </cos-card>
      <div class="flex justify-end">
        <button cos-flat-button color="primary" class="float-right">
          <i class="fa fa-file-invoice-dollar mr-8"></i>
          Create Quote
        </button>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class PresQuoteRequestComponent {}

@NgModule({
  declarations: [PresQuoteRequestComponent],
  imports: [
    CommonModule,
    CosButtonModule,
    CosCardModule,
    CosAvatarModule,
    MatMenuModule,
    CosAttributeTagModule,
  ],
  exports: [PresQuoteRequestComponent],
})
export class PresQuoteRequestComponentModule {}
