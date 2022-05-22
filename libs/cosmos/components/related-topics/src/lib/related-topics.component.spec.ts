import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosRelatedTopicsComponent } from './related-topics.component';
import { CosRelatedTopicsModule } from './related-topics.module';

const topics = [
  {
    label: 'pens with grips',
    url: '#',
  },
  {
    label: 'ballpoint pens',
    url: '#',
  },
  {
    label: 'matte finish pens',
    url: '#',
  },
  {
    label: 'plundger-action pens',
    url: '#',
  },
  {
    label: 'stationary',
    url: '#',
  },
  {
    label: 'pencils',
    url: '#',
  },
  {
    label: 'office',
    url: '#',
  },
  {
    label: 'Graphco line',
    url: '#',
  },
  {
    label: 'Gel pens',
    url: '#',
  },
  {
    label: 'office supplies',
    url: '#',
  },
  {
    label: 'usb drives',
    url: '#',
  },
  {
    label: 'journals',
    url: '#',
  },
  {
    label: 'pad folios',
    url: '#',
  },
  {
    label: 'LED Products',
    url: '#',
  },
  {
    label: 'pen and pencil sets',
    url: '#',
  },
  {
    label: 'pens with grips',
    url: '#',
  },
  {
    label: 'ballpoint pens',
    url: '#',
  },
  {
    label: 'matte finish pens',
    url: '#',
  },
  {
    label: 'plundger-action pens',
    url: '#',
  },
  {
    label: 'stationary',
    url: '#',
  },
  {
    label: 'pencils',
    url: '#',
  },
  {
    label: 'office',
    url: '#',
  },
  {
    label: 'Graphco line',
    url: '#',
  },
  {
    label: 'Gel pens',
    url: '#',
  },
  {
    label: 'office supplies',
    url: '#',
  },
  {
    label: 'usb drives',
    url: '#',
  },
  {
    label: 'journals',
    url: '#',
  },
  {
    label: 'pad folios',
    url: '#',
  },
  {
    label: 'LED Products',
    url: '#',
  },
  {
    label: 'pen and pencil sets',
    url: '#',
  },
];

describe('CosRelatedTopics', () => {
  let component: CosRelatedTopicsComponent;
  let spectator: Spectator<CosRelatedTopicsComponent>;

  const createComponent = createComponentFactory({
    component: CosRelatedTopicsComponent,
    imports: [CosRelatedTopicsModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { topics },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle visible options', () => {
    let pills = spectator.queryAll('.cos-pill');

    const morebutton: any = spectator.query('.cos-realated-topics-more');

    expect(pills.length).toBe(13);

    spectator.click(morebutton);
    spectator.detectChanges();
    pills = spectator.queryAll('.cos-pill');

    expect(pills.length).toBe(31);

    spectator.click(morebutton);
    spectator.detectChanges();
    pills = spectator.queryAll('.cos-pill');

    expect(pills.length).toBe(13);
  });
});
