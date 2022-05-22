import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { MOCK_PRODUCT } from './mocks/productData.mock';

@Component({
  selector: 'esp-presentation-products',
  templateUrl: './presentation-products.page.html',
  styleUrls: ['./presentation-products.page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductsPage {
  presentationProducts = Array(11).fill(MOCK_PRODUCT);
  showDetails = true;

  get presentation() {
    return {
      messagesUrl: '#',
      notificationsurl: '#',
      cartUrl: '#',
      // clientImage: this.clientImage,
      clientImageAlt: '',
      // date: this.date,
      // eventImage: this.eventImage,
      eventAlt: '',
      // expiration: this.expiration,
      // created: this.created,
      // budget: this.budget,
      // inHandDate: this.inHandDate,
      // attendees: this.attendees,
      // eventDate: this.eventDate,
      // clientColor: this.clientColor,
      // title: this.title,

      title: 'OrganizeIt 2020 Giveaway',
      date: 'August 8, 2020',
      expiration: 'November 12, 2020',
      inHandDate: 'November 13, 2020',
      eventDate: 'November 20, 2020',
      created: '5/14/20',
      budget: '< $15,000',
      attendees: '2,500',
      clientColor: '#8cc63f',
      clientImage: 'https://via.placeholder.com/133x36',
      eventImage: 'https://via.placeholder.com/34x34',
    };
  }
}

@NgModule({
  declarations: [PresentationProductsPage],
  imports: [
    CommonModule,
    RouterModule,

    FeatureFlagsModule,

    CosButtonModule,
    CosCardModule,
    CosProductCardModule,
  ],
})
export class PresentationProductsPageModule {
  @Input() showDetails;
  @Input() presentation;
}
