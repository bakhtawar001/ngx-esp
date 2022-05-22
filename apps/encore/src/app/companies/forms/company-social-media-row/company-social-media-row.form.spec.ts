import { dataCySelector } from '@cosmos/testing';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import { Company, WebsiteTypeEnum } from '@esp/models';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanySocialMediaRowForm,
  CompanySocialMediaRowFormModule,
} from './company-social-media-row.form';

const company = CompaniesMockDb.Companies[0];

const selectors = {
  heartIcon: dataCySelector('heart-icon'),
  panelRow: dataCySelector('social-media-row'),
  list: dataCySelector('social-media-list'),
  addEditButton: dataCySelector('action-button'),
  form: dataCySelector('social-media-form'),
  noItemsText: dataCySelector('no-social-media-text'),
};

describe('CompanySocialMediaRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanySocialMediaRowForm,
    imports: [CompanySocialMediaRowFormModule],
  });

  const testSetup = (options?: { company: Company }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(CompanyDetailLocalState, <
          Partial<CompanyDetailLocalState>
        >{
          connect() {
            return of(this);
          },
          party: options?.company || company,
          partyIsReady: true,
        }),
      ],
    });
    const component = spectator.component;
    const state = component.state;
    return { spectator, component, state };
  };

  it('should create', () => {
    const { spectator, component } = testSetup();

    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display heart icon', () => {
    const { spectator } = testSetup();
    const icon = spectator.query(selectors.heartIcon);

    expect(icon).toExist();
    expect(icon).toHaveClass('fa fa-heart');
  });

  it('should display row title', () => {
    const { spectator } = testSetup();
    const panelRow = spectator.query(selectors.panelRow);

    expect(panelRow).toHaveAttribute('rowTitle', 'Social Media');
  });

  it('should display list in following order: Facebook, Instagram, Linkedin, Pinterest, Twitter, Other', () => {
    const { spectator } = testSetup({
      company: {
        ...company,
        Websites: [
          {
            Url: 'test',
            Type: 'Facebook',
            IsPrimary: false,
          },
          {
            Url: 'test',
            Type: 'Instagram',
            IsPrimary: false,
          },
          {
            Url: 'test',
            Type: 'LinkedIn',
            IsPrimary: false,
          },
          {
            Url: 'test',
            Type: 'Pinterest',
            IsPrimary: false,
          },
          {
            Url: 'test',
            Type: 'Twitter',
            IsPrimary: false,
          },
          {
            Url: 'test',
            Type: 'Other',
            IsPrimary: false,
          },
        ],
      },
    });

    const list = spectator.queryAll(selectors.list + ' li > span');

    expect(spectator.query(selectors.noItemsText)).not.toBeVisible();
    expect(list[0].textContent.trim()).toBe('Facebook:');
    expect(list[1].textContent.trim()).toBe('Instagram:');
    expect(list[2].textContent.trim()).toBe('LinkedIn:');
    expect(list[3].textContent.trim()).toBe('Pinterest:');
    expect(list[4].textContent.trim()).toBe('Twitter:');
    expect(list[5].textContent.trim()).toBe('Other:');
  });

  it('should display only Facebook field', () => {
    const { spectator } = testSetup({
      company: {
        ...company,
        Websites: [
          {
            Url: 'test',
            Type: 'Facebook',
            IsPrimary: false,
          },
        ],
      },
    });

    const list = spectator.queryAll(selectors.list + ' li > span');

    expect(spectator.query(selectors.noItemsText)).not.toBeVisible();
    expect(list.length).toBe(1);
    expect(list[0].textContent.trim()).toBe('Facebook:');
  });

  it('should save with fb website value', () => {
    const { component, state } = testSetup();
    const stateSpy = jest.spyOn(state, 'save');

    component.form.controls.Facebook.setValue('testFb');
    component.company = company;

    component.onSocialMediaSave();

    expect(stateSpy).toHaveBeenCalledWith({
      ...company,
      Websites: [
        {
          Url: 'testFb',
          Type: WebsiteTypeEnum.Facebook,
          IsPrimary: false,
        },
      ],
    });
  });

  it('should display `No social media addresses added`', () => {
    const { spectator } = testSetup();

    expect(spectator.query(selectors.noItemsText).textContent.trim()).toEqual(
      'No social media addresses added'
    );
  });

  it('should save empty websites', () => {
    const { component, state } = testSetup();
    const stateSpy = jest.spyOn(state, 'save');

    component.company = {
      ...company,
      Websites: [
        {
          Id: 1,
          Url: 'testFb',
          IsPrimary: false,
          Type: 'Facebook',
        },
      ],
    };

    component.form.controls.Facebook.setValue('');

    component.onSocialMediaSave();

    expect(stateSpy).toHaveBeenCalledWith({
      ...company,
      Websites: [],
    });
  });

  it('should navigate to the social media link in a new tab when clicking on it', () => {
    const { spectator } = testSetup({
      company: {
        ...company,
        Websites: [
          {
            Url: 'testFacebook',
            Type: 'Facebook',
            IsPrimary: false,
          },
          {
            Url: 'testTwitter',
            Type: 'Twitter',
            IsPrimary: false,
          },
        ],
      },
    });

    const links = spectator.queryAll(selectors.list + ' li > a');

    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(links[0].getAttribute('href')).toBe(
      '//www.facebook.com/testFacebook'
    );
    expect(links[1].getAttribute('target')).toBe('_blank');
    expect(links[1].getAttribute('href')).toBe('//www.twitter.com/testTwitter');
  });
});
