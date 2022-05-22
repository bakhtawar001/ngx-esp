import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  AsiFilterPillsComponent,
  AsiFilterPillsModule,
} from './filter-pills.component';

let component: AsiFilterPillsComponent;
let spectator: Spectator<AsiFilterPillsComponent>;

const selectors = {
  filterPill: dataCySelector('filter-pill'),
  filterPillLabel: dataCySelector('filter-pill-label'),
  removeFilterIcon: dataCySelector('remove-filter-icon'),
  removeAllFilters: dataCySelector('remove-all-filters'),
};

const filterPills = [
  {
    ControlName: 'TestControlName1',
    Label: 'TestLabel1',
    Value: 'TestValue1',
  },
  {
    ControlName: 'TestControlName2',
    Label: 'TestLabel2',
    Value: 'TestValue2',
  },
  {
    ControlName: 'TestControlName3',
    Label: 'TestLabel3',
  },
];

const createComponent = createComponentFactory({
  component: AsiFilterPillsComponent,
  imports: [AsiFilterPillsModule],
  declarations: [AsiFilterPillsComponent],
});

beforeEach(() => {
  spectator = createComponent({
    props: {
      filterPills,
    },
  });
  component = spectator.component;
});

describe('AsiFilterPillsComponent', () => {
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should display 3 pills', () => {
    expect(spectator.queryAll(selectors.filterPill).length).toBe(3);
  });

  it('should display proper labels', () => {
    const filterPillLabels = spectator.queryAll(selectors.filterPillLabel);
    filterPillLabels.forEach((element, index) => {
      expect(element.innerHTML.trim()).toBe(filterPills[index].Label);
    });
  });

  it('should call remove removePill with proper parameters', () => {
    const removePillSpy = jest.spyOn(component, 'removePill');
    const removeFilterEventSpy = jest.spyOn(
      component.removeFilterEvent,
      'emit'
    );
    const removeFilterIcon = spectator.queryAll(selectors.removeFilterIcon)[0];
    spectator.click(removeFilterIcon);
    expect(removePillSpy).toHaveBeenCalledWith({
      ControlName: filterPills[0].ControlName,
      Value: filterPills[0].Value,
    });
    expect(removeFilterEventSpy).toHaveBeenCalledWith({
      ControlName: filterPills[0].ControlName,
      Value: filterPills[0].Value,
    });
  });

  it('should call remove removePill with proper parameters when pill have no value', () => {
    const removePillSpy = jest.spyOn(component, 'removePill');
    const removeFilterEventSpy = jest.spyOn(
      component.removeFilterEvent,
      'emit'
    );
    const removeFilterIcon = spectator.queryAll(selectors.removeFilterIcon)[2];
    spectator.click(removeFilterIcon);
    expect(removePillSpy).toHaveBeenCalledWith({
      ControlName: filterPills[2].ControlName,
    });
    expect(removeFilterEventSpy).toHaveBeenCalledWith({
      ControlName: filterPills[2].ControlName,
    });
  });

  it('should call remove removePill with proper parameters when removing all', () => {
    const removePillSpy = jest.spyOn(component, 'removePill');
    const removeFilterEventSpy = jest.spyOn(
      component.removeFilterEvent,
      'emit'
    );
    const removeAllFilters = spectator.query(selectors.removeAllFilters) as any;
    spectator.click(removeAllFilters);
    expect(removePillSpy).toHaveBeenCalledWith({ ClearAll: true });
    expect(removeFilterEventSpy).toHaveBeenCalledWith({ ClearAll: true });
  });
});
