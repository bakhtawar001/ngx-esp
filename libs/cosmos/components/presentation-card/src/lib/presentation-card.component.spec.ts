import { createComponentFactory } from '@ngneat/spectator/jest';
import { CosPresentationCardComponent } from './presentation-card.component';
import { CosPresentationCardModule } from './presentation-card.module';

describe('CosPresentationCardComponent', () => {
  const createComponent = createComponentFactory({
    component: CosPresentationCardComponent,
    imports: [CosPresentationCardModule],
  });

  const testSetup = (options?: { showMenu?: boolean }) => {
    const spectator = createComponent({
      props: {
        title: 'Project 123',
        subtitle: 'Company LLC',
        createdDate: '2021-12-29T11:05:47.1685186Z',
        lastUpdatedDate: '2021-12-29T11:05:47.1685186Z',
        imgUrl: 'https://placehold.it/150',
        products: [],
        showMenu: options?.showMenu || false,
      },
    });
    return { spectator, component: spectator.component };
  };

  it('should exist', () => {
    const { spectator } = testSetup();
    expect(spectator.query('.cos-presentation-card')).toBeTruthy();
  });

  it('should display the company icon of the comppany assigned to the project', () => {
    const { spectator } = testSetup();
    const image = spectator.query('cos-avatar > img');

    expect(image).toBeVisible();
  });

  it('should display the project name', () => {
    const { spectator } = testSetup();
    const title = spectator.query('.cos-presentation-title');
    expect(title.textContent.trim()).toBe('Project 123');
  });

  it('should display the customer name', () => {
    const { spectator } = testSetup();
    const subtitle = spectator.query('.cos-presentation-subtitle');
    expect(subtitle.textContent.trim()).toBe('Company LLC');
  });

  it('should display the created date', () => {
    const { spectator } = testSetup();
    const date = spectator.query('.cos-presentation-meta-date:first-child');
    expect(date.textContent.trim()).toBe('Created December 29, 2021');
  });

  it('should display the last updated date', () => {
    const { spectator } = testSetup();
    const date = spectator.query('.cos-presentation-meta-date:nth-child(1)');
    expect(date.textContent.trim()).toBe('Created December 29, 2021');
  });

  it('should display 3 dot menu when show menu is set to true', () => {
    const { spectator } = testSetup({ showMenu: true });
    const menu = spectator.query('cos-card-menu');
    expect(menu).toBeVisible();
  });

  it('should not display 3 dot menu when show menu is set to false', () => {
    const { spectator } = testSetup({ showMenu: false });
    const menu = spectator.query('cos-card-menu');
    expect(menu).not.toBeVisible();
  });
});
