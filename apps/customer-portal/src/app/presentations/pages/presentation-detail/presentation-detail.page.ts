import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosPresentationHeaderModule } from '@cosmos/components/presentation-header';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { PresentationFooterComponentModule } from '../../../core/components/footer/presentation-footer.component';

@Component({
  selector: 'esp-presentation-detail',
  templateUrl: './presentation-detail.page.html',
  styleUrls: ['./presentation-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationDetailPage {
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
  declarations: [PresentationDetailPage],
  imports: [
    CommonModule,
    CosButtonModule,
    CosPresentationHeaderModule,
    CosProductCardModule,
    PresentationFooterComponentModule,
    RouterModule,
  ],
})
export class PresentationDetailPageModule {}
