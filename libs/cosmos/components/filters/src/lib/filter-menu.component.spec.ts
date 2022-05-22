import { BreakpointObserver } from '@angular/cdk/layout';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { CosFilterMenuComponent } from './filter-menu.component';
import { CosFiltersModule } from './filters.module';

const selectors = {
  applyButton: dataCySelector('filter-apply-button'),
  filterPanel: dataCySelector('filter-panel'),
  resetButton: dataCySelector('filter-reset-button'),
};

describe('CosFilterMenuComponent', () => {
  const createComponent = createComponentFactory({
    component: CosFilterMenuComponent,
    imports: [CosFiltersModule],
  });

  const testSetup = (options?: { props: Partial<CosFilterMenuComponent> }) => {
    const spectator = createComponent({
      props: {
        label: 'Exclude',
        applied: true,
        disabled: false,
        applyDisabled: false,
        ...options?.props,
      },
      providers: [
        mockProvider(BreakpointObserver, {
          observe: () => of({ matches: true }),
        }),
      ],
    });

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  it('should close filter panel when filters applied', () => {
    const { spectator } = testSetup({ props: { expanded: true } });

    expect(spectator.query(selectors.filterPanel)).toExist();

    spectator.click(spectator.query(selectors.applyButton));

    expect(spectator.query(selectors.filterPanel)).not.toExist();
  });

  it('should close filter panel when filters reset', () => {
    const { spectator } = testSetup({ props: { expanded: true } });

    expect(spectator.query(selectors.filterPanel)).toExist();

    spectator.click(spectator.query(selectors.resetButton));

    expect(spectator.query(selectors.filterPanel)).not.toExist();
  });

  it('should close filter panel when clicked outside', () => {
    const { spectator } = testSetup({ props: { expanded: true } });

    expect(spectator.query(selectors.filterPanel)).toExist();

    spectator.click(spectator.element);

    expect(spectator.query(selectors.filterPanel)).not.toExist();
  });
});
