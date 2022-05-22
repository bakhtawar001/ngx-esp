import { waitForAsync } from '@angular/core/testing';
import { NavigationItem } from '@cosmos/layout';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { ActiveNavigationItemService } from './active-navigation-item.service';

describe('ActiveNavigationItemService', () => {
  const createService = createServiceFactory(ActiveNavigationItemService);

  const testSetup = () => {
    const spectator = createService();
    return { spectator, service: spectator.service };
  };

  it('should create', () => {
    const { service } = testSetup();

    expect(service).toBeTruthy();
  });

  it('should emit null from activeItem$ as a default value', () => {
    const { service } = testSetup();

    service.activeItem$.subscribe((val) => {
      expect(val).toBeNull();
    });
  });

  it(
    'should emit active item from activeItem$ when updated',
    waitForAsync(() => {
      const { service } = testSetup();
      const item: NavigationItem = {
        id: 'test-item',
        type: 'item',
        title: 'Test item title',
      };

      service.updateActiveItem(item);
      service.activeItem$.subscribe((val) => {
        expect(val).toBe(item);
      });
    })
  );
});
