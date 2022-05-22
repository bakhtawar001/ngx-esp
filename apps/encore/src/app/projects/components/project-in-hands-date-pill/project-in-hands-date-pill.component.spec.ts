import { dataCySelector } from '@cosmos/testing';
import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';

import {
  ProjectInHandsDatePillComponent,
  ProjectInHandsDatePillModule,
} from './project-in-hands-date-pill.component';

const pillSelector = dataCySelector('in-hands-date-pill');

describe('ProjectInHandsDatePillComponent', () => {
  let spectator: Spectator<ProjectInHandsDatePillComponent>;

  const createComponent = createComponentFactory({
    component: ProjectInHandsDatePillComponent,
    imports: [ProjectInHandsDatePillModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('Should not display In-Hands Date Pill when property IsInHandsDateFlexible is not defined for ProjectSearch entity ', () => {
    spectator.detectComponentChanges();

    expect(spectator.query(pillSelector)).toBeFalsy();
  });

  it('Should display In-Hands Date Pill with Flexible text', () => {
    spectator.component.isInHandsDateFlexible = true;

    spectator.detectComponentChanges();

    expect(spectator.query(pillSelector).textContent.trim()).toEqual(
      'Flexible'
    );
  });

  it('Should display In-Hands Date Pill with Firm text', () => {
    spectator.component.isInHandsDateFlexible = false;

    spectator.detectComponentChanges();

    expect(spectator.query(pillSelector).textContent.trim()).toEqual('Firm');
  });
});
