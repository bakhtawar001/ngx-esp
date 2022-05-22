import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosExploreBarComponent } from './explore-bar.component';
import { CosExploreBarModule } from './explore-bar.module';

describe('CosExploreBarComponent', () => {
  let component: CosExploreBarComponent;
  let spectator: Spectator<CosExploreBarComponent>;
  const createComponent = createComponentFactory({
    component: CosExploreBarComponent,
    imports: [CosExploreBarModule],
    declareComponent: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component.ariaLabel = 'Explore';
    component.navItems = [
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
        ],
      },
      {
        title: 'Featured',
        url: '#',
      },
    ];
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
