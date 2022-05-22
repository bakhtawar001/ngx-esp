# Presentation Header

Component Usage:

```
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
      <a href="#"><i class="fa fa-share"></i> Reply</a>
    </cos-presentation-header>

```

Data Example:

```
  presentation = {
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
    budget: '<$15,000',
    inHandDate: '7/28/20',
    attendees: '2,500',
    eventDate: '8/8/20',
  };

  showDetails = true;

```
