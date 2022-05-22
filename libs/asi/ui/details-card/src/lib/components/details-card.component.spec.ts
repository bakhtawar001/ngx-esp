import { fakeAsync } from '@angular/core/testing';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  AsiUiDetailsCardComponent,
  AsiUiDetailsCardComponentModule,
} from '../components';

let component: AsiUiDetailsCardComponent;
let spectator: Spectator<AsiUiDetailsCardComponent>;

const card = {
  avatar: dataCySelector('avatar'),
  title: dataCySelector('title'),
  firstSubtitle: dataCySelector('first-subtitle'),
  secondSubtitle: dataCySelector('second-subtitle'),
  firstDetails: dataCySelector('first-line-details'),
  secondDetails: dataCySelector('second-line-details'),
};

const createComponent = createComponentFactory({
  component: AsiUiDetailsCardComponent,
  imports: [AsiUiDetailsCardComponentModule],
  declarations: [AsiUiDetailsCardComponent],
});

beforeEach(() => {
  spectator = createComponent();
  component = spectator.component;
});

describe('AsiUiDetailsCardComponent', () => {
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('Title tests', () => {
    it('should show title if it is passed through input', fakeAsync(() => {
      component.title = 'Test title';
      spectator.detectComponentChanges();
      expect(spectator.query(card.title)?.textContent?.trim()).toEqual(
        'Test title'
      );
    }));

    it('should not show title if it is not passed through input', fakeAsync(() => {
      spectator.detectComponentChanges();
      expect(spectator.query(card.title)?.textContent?.trim()).toBeFalsy();
    }));
  });

  describe('Subtitle tests', () => {
    it('should show first subtitle if it is passed through input', fakeAsync(() => {
      component.subtitleFirstLine = 'Test subtitle';
      spectator.detectComponentChanges();
      expect(spectator.query(card.firstSubtitle)?.textContent?.trim()).toEqual(
        'Test subtitle'
      );
    }));

    it('should not show first subtitle if it is not passed through input', fakeAsync(() => {
      spectator.detectComponentChanges();
      expect(
        spectator.query(card.firstSubtitle)?.textContent?.trim()
      ).toBeFalsy();
    }));

    it('should show second subtitle if it is passed through input', fakeAsync(() => {
      component.subtitleSecondLine = 'Test subtitle';
      spectator.detectComponentChanges();
      expect(spectator.query(card.secondSubtitle)?.textContent?.trim()).toEqual(
        'Test subtitle'
      );
    }));

    it('should not show second subtitle if it is not passed through input', fakeAsync(() => {
      spectator.detectComponentChanges();
      expect(
        spectator.query(card.secondSubtitle)?.textContent?.trim()
      ).toBeFalsy();
    }));
  });

  describe('First line details tests', () => {
    it('should show first line details if it is passed through input', fakeAsync(() => {
      component.firstLineDetails = 'Test details 1';
      spectator.detectComponentChanges();
      expect(spectator.query(card.firstDetails)?.textContent?.trim()).toEqual(
        'Test details 1'
      );
    }));

    it('should not show first line of details if it is not passed through input', fakeAsync(() => {
      spectator.detectComponentChanges();
      expect(
        spectator.query(card.firstDetails)?.textContent?.trim()
      ).toBeFalsy();
    }));
  });

  describe('Second line details tests', () => {
    it('should show second line details if it is passed through input', fakeAsync(() => {
      component.secondLineDetails = 'Test details 2';
      spectator.detectComponentChanges();
      expect(spectator.query(card.secondDetails)?.textContent?.trim()).toEqual(
        'Test details 2'
      );
    }));

    it('should not show second line of details if it is not passed through input', fakeAsync(() => {
      spectator.detectComponentChanges();
      expect(
        spectator.query(card.secondDetails)?.textContent?.trim()
      ).toBeFalsy();
    }));
  });
});
