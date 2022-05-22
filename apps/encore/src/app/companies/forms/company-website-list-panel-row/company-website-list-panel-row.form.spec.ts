import { dataCySelector } from '@cosmos/testing';
import { CompaniesMockDb } from '@esp/companies/mocks';
import { Website } from '@esp/models';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanyWebsiteListPanelRowForm,
  CompanyWebsiteListPanelRowFormModule,
} from './company-website-list-panel-row.form';

const company = CompaniesMockDb.Companies[0];
const header = {
  title: dataCySelector('panel-row'),
  icon: '.form-row-icon',
};
const noWebsitesMessage = dataCySelector('no-websites');
const row = {
  primaryPill: dataCySelector('primary-pill'),
  toggleEditButton: dataCySelector('action-button'),
  link: dataCySelector('website-url'),
  readView: dataCySelector('read-view'),
  editForm: dataCySelector('website-form'),
};

const createComponent = createComponentFactory({
  component: CompanyWebsiteListPanelRowForm,
  imports: [CompanyWebsiteListPanelRowFormModule, NgxsModule.forRoot()],
});

const testSetup = (options?: {
  websites?: Partial<Website>[];
  isEditable?: boolean;
}) => {
  const companyDetailLocalStateOverride = {
    isLoading: false,
    hasLoaded: true,
    partyIsReady: true,
    connect: () =>
      of({
        party: {
          IsEditable: options?.isEditable,
          Websites: options?.websites ?? [],
        },
        partyIsReady: true,
      }),
    party: {
      ...company,
      Websites: options?.websites ?? [],
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    save: () => {},
  };
  const spectator = createComponent({
    providers: [
      mockProvider(CompanyDetailLocalState, companyDetailLocalStateOverride),
      {
        provide: PARTY_LOCAL_STATE,
        useValue: companyDetailLocalStateOverride,
      },
    ],
  });

  const component = spectator.component;
  const state = spectator.inject(CompanyDetailLocalState, true);

  spectator.detectChanges();
  spectator.detectComponentChanges();

  return {
    spectator,
    component,
    state,
  };
};

describe('CompanyWebsiteListPanelRowForm', () => {
  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  describe('Header', () => {
    it('should display title', () => {
      const { spectator } = testSetup();

      expect(spectator.query(header.title).getAttribute('rowTitle')).toEqual(
        'Websites'
      );
    });

    it('should display icon', () => {
      const { spectator } = testSetup();

      expect(spectator.query(header.icon).classList).toContain('fa-globe');
    });
  });

  describe('Row', () => {
    it('should display message when there are no websites added', () => {
      const { spectator } = testSetup({ websites: [] });

      expect(spectator.query(noWebsitesMessage)).toBeTruthy();
      expect(spectator.query(noWebsitesMessage).textContent.trim()).toEqual(
        'No website addresses added'
      );
    });

    it('should display toggle edit button when user is admin', () => {
      const { spectator } = testSetup({ isEditable: true });

      expect(spectator.query(row.toggleEditButton)).toBeTruthy();
    });

    it('should display toggle edit button when user is owner of record', () => {
      const { spectator } = testSetup({ isEditable: true });

      expect(spectator.query(row.toggleEditButton)).toBeTruthy();
    });

    it('should display toggle edit button when user is collaborator and has rights to edit', () => {
      const { spectator } = testSetup({ isEditable: true });

      expect(spectator.query(row.toggleEditButton)).toBeTruthy();
    });

    it('should not display toggle edit button when user is not admin', () => {
      const { spectator } = testSetup({ isEditable: false });

      expect(spectator.query(row.toggleEditButton)).toBeFalsy();
    });

    it('should not display toggle edit button when user is owner of record', () => {
      const { spectator } = testSetup({ isEditable: false });

      expect(spectator.query(row.toggleEditButton)).toBeFalsy();
    });

    it('should not display toggle edit button when user is collaborator and has rights to edit', () => {
      const { spectator } = testSetup({ isEditable: false });

      expect(spectator.query(row.toggleEditButton)).toBeFalsy();
    });

    it('should display Add button when there are no websites added', () => {
      const { spectator } = testSetup({ isEditable: true, websites: [] });

      expect(spectator.query(row.toggleEditButton)).toBeTruthy();
      expect(spectator.query(row.toggleEditButton).textContent.trim()).toEqual(
        'Add'
      );
    });

    it('should display Edit button when there are websites', () => {
      const { spectator } = testSetup({
        isEditable: true,
        websites: [{ Type: 'Corporate' as any, Url: 'google.com' }],
      });

      expect(spectator.query(row.toggleEditButton)).toBeTruthy();
      expect(spectator.query(row.toggleEditButton).textContent.trim()).toEqual(
        'Edit'
      );
    });

    it('should show primary website pill', () => {
      const { spectator } = testSetup({
        websites: [{ Url: 'google.com', IsPrimary: true }],
      });

      expect(spectator.queryAll(row.primaryPill).length).toBe(1);
      expect(spectator.query(row.primaryPill)).toBeTruthy();
    });

    it('should open read view as default', () => {
      const { spectator } = testSetup();

      expect(spectator.query(row.editForm)).toBeFalsy();
      expect(spectator.query(row.readView)).toBeTruthy();
    });

    it('should open edit view', () => {
      const { spectator } = testSetup({
        isEditable: true,
      });

      spectator.click(row.toggleEditButton);

      expect(spectator.query(row.editForm)).toBeTruthy();
      expect(spectator.query(row.readView)).toBeFalsy();
    });

    it('should navigate to the website link in a new tab when clicking on it', () => {
      const { spectator } = testSetup({
        websites: [{ Url: 'google.com' }],
      });

      expect(spectator.query(row.link)).toBeTruthy();
      expect(spectator.query(row.link).getAttribute('target')).toBe('_blank');
      expect(spectator.query(row.link).getAttribute('href')).toBe(
        '//google.com'
      );
    });
  });
});
