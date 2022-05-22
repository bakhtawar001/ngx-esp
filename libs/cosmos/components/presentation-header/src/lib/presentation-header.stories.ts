import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosButtonModule } from '@cosmos/components/button';
import { arg } from '@cosmos/storybook';
import markdown from './presentation-header.md';
import { CosPresentationHeaderModule } from './presentation-header.module';

@Component({
  selector: 'cos-demo-component',
  template: `
    <cos-presentation-header
      [presentation]="presentation"
      [showDetails]="showDetails"
    >
      <p>Hey Elizabeth,</p>

      <p>
        Here are a handful of products that I think you might be interested for
        this year’s OrganizeIt giveaway. Feel free to respond here or give me an
        email or a call. Take care!
      </p>

      <p>
        Linda Davis <br />
        (866) 555-1234 ext. 51 <br />
        <a href="mailto:linda.davis@kraftwerk.com">linda.davis@kraftwerk.com</a>
      </p>

      <a cos-button class="presentation-header-reply-btn" href="#"
        ><i class="fa fa-share"></i> Reply</a
      >
    </cos-presentation-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosDemoComponent {
  @Input() title;
  @Input() date;
  @Input() expiration;
  @Input() created;
  @Input() budget;
  @Input() inHandDate;
  @Input() attendees;
  @Input() eventDate;
  @Input() clientImage;
  @Input() eventImage;
  @Input() clientColor;
  @Input() showDetails;

  get presentation() {
    return {
      messagesUrl: '#',
      notificationsurl: '#',
      cartUrl: '#',
      clientImage: this.clientImage,
      clientImageAlt: '',
      title: this.title,
      date: this.date,
      eventImage: this.eventImage,
      eventAlt: '',
      expiration: this.expiration,
      // created: this.created,
      budget: this.budget,
      inHandDate: this.inHandDate,
      attendees: this.attendees,
      eventDate: this.eventDate,
      clientColor: this.clientColor,
    };
  }
}

export default {
  title: 'Layout Examples/Presentation Header',
  parameters: {
    notes: markdown,
  },
  args: {
    showDetails: true,
    title: 'OrganizeIt 2020 Giveaway',
    date: 'August 8, 2020',
    expiration: 'November 12, 2020',
    inHandDate: 'November 13, 2020',
    eventDate: 'November 20, 2020',
    budget: '< $15,000',
    attendees: '2,500',
    clientColor: '#8cc63f',
    clientImage: 'https://via.placeholder.com/133x36',
    eventImage: 'https://via.placeholder.com/34x34',
  },
  argTypes: {
    showDetails: arg('Show Details', 'boolean'),
    title: arg('Title'),
    date: arg('Date'),
    expiration: arg('Expiration'),
    inHandDate: arg('In Hand Date'),
    eventDate: arg('Event Date'),
    // created: arg('Created'),
    budget: arg('Budget'),
    attendees: arg('Attendees'),
    clientColor: arg('Client Color', 'color'),
    clientImage: arg('Client Image Url'),
    eventImage: arg('Event Image Url'),
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosPresentationHeaderModule,
      CosButtonModule,
    ],
  },
  component: CosDemoComponent,
  props,
});
