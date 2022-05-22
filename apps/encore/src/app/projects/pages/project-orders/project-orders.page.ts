import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosRatingModule } from '@cosmos/components/rating';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { CardMetadataListModule } from '../../../core/components/cards';
// import { ProjectOrderSidebarModule } from '../../components/project-order-sidebar';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-project-orders',
  templateUrl: './project-orders.page.html',
  styleUrls: ['./project-orders.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectOrdersPage {
  project = {
    createdOn: 'November 12, 2020',
    inHandDate: 'November 13, 2020',
    eventDate: 'November 20, 2020',
    budget: '< $15,000',
    attendees: '2,500',
  };
  supplier = {
    Name: 'St Regis Group',
    Id: '7730',
    AsiNumber: '84592',
    Preferred: {
      Name: 'Platinum',
    },
    Phone: '',
    Fax: null,
    Email: '',
    Websites: [
      'http://www.asiqasupplier1.com',
      'http://www.asiqasupplier1.com',
    ],
    Address: null,
    OfficeHours: null,
    Orders: '',
    Type: null,
    Artwork: '',
    ProductionTime: null,
    ImprintingMethods: null,
    MarketingPolicy: null,
    YearEstablished: null,
    YearInIndustry: null,
    TotalEmployees: null,
    IsMinorityOwned: null,
    IsUnionAvailable: null,
    IsCanadian: null,
    IsCanadianFriendly: null,
    HasDistributorAffiliation: null,
    Functions: null,
    Rating: {
      Rating: 5,
      Companies: 22,
      Transactions: 22,
    },
    Ratings: {
      OverAll: {
        Rating: 5,
        Companies: 22,
        Transactions: 22,
      },
      Quality: { Rating: 9, Companies: 36, Transactions: 206 },
      Communication: { Rating: 9, Companies: 35, Transactions: 202 },
      Delivery: { Rating: 9, Companies: 34, Transactions: 201 },
      ConflictResolution: { Rating: 8, Companies: 13, Transactions: 133 },
      Decoration: { Rating: 9, Companies: 34, Transactions: 201 },
    },
  };
}

@NgModule({
  declarations: [ProjectOrdersPage],
  imports: [
    CommonModule,
    CosCardModule,
    //   ProjectOrderSidebarModule,
    CardMetadataListModule,
    MatMenuModule,
    CosButtonModule,
    CosSupplierModule,
    CosRatingModule,
    CosAttributeTagModule,
  ],
})
export class ProjectOrdersPageModule {}
