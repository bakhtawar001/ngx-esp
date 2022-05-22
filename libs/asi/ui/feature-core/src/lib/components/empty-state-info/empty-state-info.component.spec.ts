import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  AsiEmptyStateInfoComponent,
  AsiEmptyStateInfoModule,
} from './empty-state-info.component';

const mainText = dataCySelector('main-text');
const secondText = dataCySelector('second-text');
const thirdText = dataCySelector('third-text');

describe('AsiEmptyStateInfoComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiEmptyStateInfoComponent,
    imports: [AsiEmptyStateInfoModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  it('should display main text which is passed through input', () => {
    const { spectator, component } = testSetup();
    component.mainText = 'Main';
    spectator.detectComponentChanges();

    expect(spectator.query(mainText).textContent.trim()).toEqual('Main');
  });

  it('should display second text which is passed through input', () => {
    const { spectator, component } = testSetup();
    component.secondText = 'Second';
    spectator.detectComponentChanges();

    expect(spectator.query(secondText).textContent.trim()).toEqual('Second');
  });

  it('should display third text which is passed through input', () => {
    const { spectator, component } = testSetup();
    component.thirdText = 'Third';
    spectator.detectComponentChanges();

    expect(spectator.query(thirdText).textContent.trim()).toEqual('Third');
  });
});
