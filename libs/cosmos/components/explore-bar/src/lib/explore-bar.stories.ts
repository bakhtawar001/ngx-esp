import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosExploreBarComponent } from './explore-bar.component';
import markdown from './explore-bar.md';
import { CosExploreBarModule } from './explore-bar.module';

export default {
  title: 'Navigation/Explore Bar',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, CosExploreBarModule],
    declarations: [],
  },
  component: CosExploreBarComponent,
  props: {
    ariaLabel: 'Explore',
    navItems: [
      {
        id: '1',
        title: 'Categories',
        type: 'collapsable',
        children: [
          {
            title: 'Awards',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Awards',
                url: '#',
              },
              {
                title: 'Lapel Pins',
                url: '#',
              },
            ],
          },
          {
            title: 'Bags and Luggage',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Backpacks',
                url: '#',
              },
              {
                title: 'Plastic Bags',
                url: '#',
              },
              {
                title: 'Tote Bags',
                url: '#',
              },
            ],
          },
          {
            title: 'Lanyards and Badges',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Badge Holders',
                url: '#',
              },
              {
                title: 'Lanyards',
                url: '#',
              },
            ],
          },
          {
            title: 'Candy and Food',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Cookies',
                url: '#',
              },
              {
                title: 'Mints',
                url: '#',
              },
              {
                title: 'Wine',
                url: '#',
              },
            ],
          },
          {
            title: 'Drinkware',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Beverage Holders',
                url: '#',
              },
              {
                title: 'Bottles',
                url: '#',
              },
              {
                title: 'Coasters',
                url: '#',
              },
              {
                title: 'Cups',
                url: '#',
              },
              {
                title: 'Mugs & Steins',
                url: '#',
              },
              {
                title: 'Straws',
                url: '#',
              },
              {
                title: 'Mugs & Cups',
                url: '#',
              },
              {
                title: 'Tumblers',
                url: '#',
              },
            ],
          },
          {
            title: 'Electronics',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Flashlights',
                url: '#',
              },
              {
                title: 'Mobile Accessories',
                url: '#',
              },
              {
                title: 'Power Banks',
                url: '#',
              },
              {
                title: 'Speakers',
                url: '#',
              },
              {
                title: 'USB/Flash Drives',
                url: '#',
              },
            ],
          },
          {
            title: 'Health and Wellness',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Candles',
                url: '#',
              },
              {
                title: 'First Aid Kits',
                url: '#',
              },
              {
                title: 'Hand Sanitizers',
                url: '#',
              },
              {
                title: 'Lip Balm',
                url: '#',
              },
              {
                title: 'Pillows',
                url: '#',
              },
              {
                title: 'Sunscreen',
                url: '#',
              },
            ],
          },
          {
            title: 'Magnets, Decals, and Stickers',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Magnets',
                url: '#',
              },
              {
                title: 'Stickers',
                url: '#',
              },
            ],
          },
          {
            title: 'Wearables',
            type: 'group',
            url: '#',
            children: [
              {
                title: 'Shirts',
                url: '#',
              },
              {
                title: 'Hats',
                url: '#',
              },
              {
                title: 'Outerwear',
                url: '#',
              },
              {
                title: 'Socks',
                url: '#',
              },
            ],
          },
        ],
      },
      {
        title: 'Featured',
        url: '#',
      },
      {
        title: 'Best Sellers',
        url: '#',
      },
      {
        title: 'Deals',
        url: '#',
      },
      {
        title: "What's New",
        url: '#',
      },
      {
        title: 'Get It Fast',
        url: '#',
      },
      {
        title: 'Wellness Essentials',
        url: '#',
      },
      {
        title: 'Working from Home',
        url: '#',
      },
      {
        title: 'Cool for the Summer',
        url: '#',
      },
    ],
  },
});
