import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AsiManageCollaboratorsModule } from '@asi/collaborators/ui/feature-core';
import { AsiCompanyAvatarModule } from '@asi/company/ui/feature-components';
import { CosButtonModule } from '@cosmos/components/button';
import { CardMetadataListModule } from '../../../core/components/cards';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';
import { WebsiteTabsMenu } from '../../configs';

@Component({
  selector: 'esp-website-detail',
  templateUrl: './website-detail.page.html',
  styleUrls: ['./website-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteDetailPage {
  tabs = WebsiteTabsMenu;
  state = {
    canEdit: true,
    website: {
      Access: [
        {
          AccessLevel: 'Everyone',
          EntityId: 0,
          AccessType: 'ReadWrite',
        },
      ],
      AccessLevel: 'Everyone',
      Name: 'East Coast Promo Products',
      Customer: {
        PrimaryBrandColor: '#6A7281',
        LogoImageUrl:
          'https://commonmedia.uat-asicentral.com/orders/Artwork/5ebd08ac8357422f8fe608bcce889381.png',
        Types: ['Supplier'],
        Id: 513542439,
        Name: 'Advertising Specialty Institute',
        IconImageUrl:
          'https://commonmedia.uat-asicentral.com/orders/Artwork/6129d0d765a342b19b8c5f3ce9675099.png',
      },
      CreateDate: '2021-11-11T22:47:15.297',
      Collaborators: [
        {
          Id: 28966,
          Name: 'Leigh Penny',
          Email: 'lpenny@asicentral.com',
          IsTeam: false,
          Role: 'Owner',
        },
      ],
      IsEditable: true,
      OwnerId: 28966,
      Owner: {
        Id: 28966,
        Name: 'Leigh Penny',
      },
    },
  };
}

@NgModule({
  declarations: [WebsiteDetailPage],
  imports: [
    CommonModule,
    RouterModule,

    MatMenuModule,
    MatTabsModule,

    CosButtonModule,

    CardMetadataListModule,
    AsiCompanyAvatarModule,
    DetailHeaderComponentModule,
    AsiManageCollaboratorsModule,
  ],
  exports: [WebsiteDetailPage],
})
export class WebsiteDetailPageModule {}
