import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosDropdownFilterComponent } from './dropdown-filter.component';
import { CosDropdownFilterModule } from './dropdown-filter.module';
const data = {
  Categories: [
    {
      Id: '4294130786',
      Name: 'MUGS & STEINS',
      ContextPath: '4294468135:4294130786||1',
      Products: 12832,
      Subcategories: [
        {
          Id: '1',
          Name: 'Huge Thor Beer Steins',
          Products: 23,
        },
        {
          Id: '2',
          Name: 'Bob Ross Mugs',
          Products: 2,
        },
        {
          Id: '3',
          Name: 'Tiny Novelty Mugs',
          Products: 5,
        },
        {
          Id: '4',
          Name: 'Stemmed Mugs',
          Products: 4,
        },
      ],
    },
    {
      Id: '4294130178',
      Name: 'TRAVEL MUGS/CUPS',
      ContextPath: '4294468135:4294130178||1',
      Products: 8455,
      Subcategories: [
        {
          Id: '1',
          Name: 'Spill Proof',
          Products: 12,
        },
        {
          Id: '2',
          Name: 'One Handed',
          Products: 30,
        },
        {
          Id: '3',
          Name: 'Stainless Steel',
          Products: 47,
        },
      ],
    },
    {
      Id: '4294131231',
      Name: 'GLASSES-DRINKING',
      ContextPath: '4294468135:4294131231||1',
      Products: 3808,
      Subcategories: [
        {
          Id: '1',
          Name: 'Collins Glasses',
          Products: 5,
        },
        {
          Id: '2',
          Name: 'Martini Glasses',
          Products: 8,
        },
        {
          Id: '3',
          Name: 'Coupes',
          Products: 2,
        },
        {
          Id: '4',
          Name: 'Old Fashioneds',
          Products: 12,
        },
        {
          Id: '5',
          Name: 'Double Old Fashioneds',
          Products: 25,
        },
        {
          Id: '6',
          Name: 'Nick & Nora Glasses',
          Products: 6,
        },
      ],
    },
    {
      Id: '4294131782',
      Name: 'BOTTLES',
      ContextPath: '4294468135:4294131782||1',
      Products: 2038,
    },
    {
      Id: '4294131487',
      Name: 'CUPS',
      ContextPath: '4294468135:4294131487||1',
      Products: 1920,
    },
    {
      Id: '4294131239',
      Name: 'GIFT BASKETS & SETS',
      ContextPath: '4294468135:4294131239||1',
      Products: 1119,
    },
    {
      Id: '4294131308',
      Name: 'FOOD GIFTS',
      ContextPath: '4294468135:4294131308||1',
      Products: 1009,
    },
    {
      Id: '4294131696',
      Name: 'CANDY',
      ContextPath: '4294468135:4294131696||1',
      Products: 878,
    },
    {
      Id: '4294131536',
      Name: 'COFFEE',
      ContextPath: '4294468135:4294131536||1',
      Products: 553,
    },
    {
      Id: '4294131541',
      Name: 'COASTERS & COASTER SETS',
      ContextPath: '4294468135:4294131541||1',
      Products: 319,
    },
    {
      Id: '4294130515',
      Name: 'PROMOTIONS',
      ContextPath: '4294468135:4294130515||1',
      Products: 258,
    },
    {
      Id: '4294131842',
      Name: 'BAR ACCESSORIES',
      ContextPath: '4294468135:4294131842||1',
      Products: 241,
    },
    {
      Id: '4294130964',
      Name: 'KITS',
      ContextPath: '4294468135:4294130964||1',
      Products: 224,
    },
    {
      Id: '4294130113',
      Name: 'WINE GLASSES',
      ContextPath: '4294468135:4294130113||1',
      Products: 199,
    },
    {
      Id: '4294130235',
      Name: 'TOOLS-KITCHEN',
      ContextPath: '4294468135:4294130235||1',
      Products: 179,
    },
    {
      Id: '4293114997',
      Name: 'BEVERAGE HOLDERS',
      ContextPath: '4294468135:4293114997||1',
      Products: 152,
    },
    {
      Id: '4294130273',
      Name: 'TEA OR COFFEE SETS',
      ContextPath: '4294468135:4294130273||1',
      Products: 150,
    },
    {
      Id: '4294131476',
      Name: 'CUSTOM PRODUCTS',
      ContextPath: '4294468135:4294131476||1',
      Products: 146,
    },
    {
      Id: '4294131817',
      Name: 'BEVERAGES',
      ContextPath: '4294468135:4294131817||1',
      Products: 140,
    },
    {
      Id: '4294130349',
      Name: 'STADIUM CUPS',
      ContextPath: '4294468135:4294130349||1',
      Products: 136,
    },
    {
      Id: '4293824931',
      Name: 'LED PRODUCTS',
      ContextPath: '4294468135:4293824931||1',
      Products: 133,
    },
    {
      Id: '4294130372',
      Name: 'SPECIALTIES CUSTOM MADE',
      ContextPath: '4294468135:4294130372||1',
      Products: 126,
    },
    {
      Id: '4294130413',
      Name: 'SHOT GLASSES',
      ContextPath: '4294468135:4294130413||1',
      Products: 116,
    },
    {
      Id: '4294131869',
      Name: 'BAGS',
      ContextPath: '4294468135:4294131869||1',
      Products: 107,
    },
    {
      Id: '4293997929',
      Name: 'COOLERS',
      ContextPath: '4294468135:4293997929||1',
      Products: 106,
    },
    {
      Id: '4294131633',
      Name: 'CARABINERS',
      ContextPath: '4294468135:4294131633||1',
      Products: 95,
    },
    {
      Id: '4294131504',
      Name: 'COVERS',
      ContextPath: '4294468135:4294131504||1',
      Products: 76,
    },
    {
      Id: '4294131537',
      Name: 'COCKTAIL MIXERS & SHAKERS',
      ContextPath: '4294468135:4294131537||1',
      Products: 70,
    },
    {
      Id: '4294131325',
      Name: 'FLASKS',
      ContextPath: '4294468135:4294131325||1',
      Products: 64,
    },
    {
      Id: '4294131194',
      Name: 'GLOW PRODUCTS',
      ContextPath: '4294468135:4294131194||1',
      Products: 60,
    },
    {
      Id: '4294131532',
      Name: 'COINS-TOKENS & MEDALLIONS',
      ContextPath: '4294468135:4294131532||1',
      Products: 57,
    },
    {
      Id: '4294130530',
      Name: 'PRETZELS',
      ContextPath: '4294468135:4294130530||1',
      Products: 55,
    },
    {
      Id: '4294131056',
      Name: 'KEY CHAINS',
      ContextPath: '4294468135:4294131056||1',
      Products: 46,
    },
    {
      Id: '4294131517',
      Name: 'CONTAINERS',
      ContextPath: '4294468135:4294131517||1',
      Products: 45,
    },
    {
      Id: '4294130201',
      Name: 'TOTE BAGS',
      ContextPath: '4294468135:4294130201||1',
      Products: 43,
    },
    {
      Id: '4294131521',
      Name: 'COMPUTER ACCESSORIES',
      ContextPath: '4294468135:4294131521||1',
      Products: 38,
    },
    {
      Id: '4294130352',
      Name: 'SPORTS MEMORABILIA',
      ContextPath: '4294468135:4294130352||1',
      Products: 35,
    },
    {
      Id: '4294131689',
      Name: 'CANDY DISHES',
      ContextPath: '4294468135:4294131689||1',
      Products: 34,
    },
    {
      Id: '4294131887',
      Name: 'AUTO ACCESSORIES',
      ContextPath: '4294468135:4294131887||1',
      Products: 31,
    },
    {
      Id: '4294131137',
      Name: 'HANDLES',
      ContextPath: '4294468135:4294131137||1',
      Products: 29,
    },
    {
      Id: '4294131573',
      Name: 'CLIPS-UTILITY',
      ContextPath: '4294468135:4294131573||1',
      Products: 13,
    },
    {
      Id: '4294131447',
      Name: 'DESK ACCESSORIES',
      ContextPath: '4294468135:4294131447||1',
      Products: 12,
    },
    {
      Id: '4294131827',
      Name: 'BASKETS',
      ContextPath: '4294468135:4294131827||1',
      Products: 11,
    },
    {
      Id: '4294130588',
      Name: 'PLACE MATS',
      ContextPath: '4294468135:4294130588||1',
      Products: 11,
    },
    {
      Id: '4294130733',
      Name: 'ORGANIZERS',
      ContextPath: '4294468135:4294130733||1',
      Products: 9,
    },
    {
      Id: '4294131680',
      Name: 'CAPS & HATS',
      ContextPath: '4294468135:4294131680||1',
      Products: 8,
    },
    {
      Id: '4294131760',
      Name: 'BRUSHES',
      ContextPath: '4294468135:4294131760||1',
      Products: 6,
    },
    {
      Id: '4294131632',
      Name: 'CARAFE SETS',
      ContextPath: '4294468135:4294131632||1',
      Products: 3,
    },
    {
      Id: '4294131630',
      Name: 'CARDS',
      ContextPath: '4294468135:4294131630||1',
      Products: 3,
    },
    {
      Id: '4294131524',
      Name: 'COMPACTS & POCKET MIRRORS',
      ContextPath: '4294468135:4294131524||1',
      Products: 3,
    },
  ],
};

describe('CosDropdownFilterComponent', () => {
  let component: CosDropdownFilterComponent;
  let spectator: Spectator<CosDropdownFilterComponent>;
  const createComponent = createComponentFactory({
    component: CosDropdownFilterComponent,
    imports: [CosDropdownFilterModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        data: data.Categories,
        labelText: 'Categories',
        placeholderText: 'Search',
      },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(component).toExist();
  });
});
