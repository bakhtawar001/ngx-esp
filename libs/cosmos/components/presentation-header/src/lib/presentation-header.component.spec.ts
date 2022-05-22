import { RouterModule } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosPresentationHeaderComponent } from './presentation-header.component';
import { CosPresentationHeaderModule } from './presentation-header.module';

describe('CosPresentationHeader', () => {
  let spectator: Spectator<CosPresentationHeaderComponent>;
  const createComponent = createComponentFactory({
    component: CosPresentationHeaderComponent,
    imports: [CosPresentationHeaderModule, RouterModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        presentation: {
          messagesUrl: '#',
          notificationsurl: '#',
          cartUrl: '#',
          clientImage: 'https://via.placeholder.com/133x36',
          clientImageAlt: '',
          title: 'OrganizeIt 2020 Giveaway',
          date: 'August 8, 2020',
          eventImage: 'https://via.placeholder.com/171x36',
          eventAlt: '',
          expiration: '7/28/20',
          created: '5/14/20',
          budget: '$15,000',
          inHandDate: '7/28/20',
          attendees: '2,500',
          eventDate: '8/8/20',
        },
        showDetails: true,
      },
    });
  });

  it('should exist', () => {
    expect(spectator).toExist();
  });
});
