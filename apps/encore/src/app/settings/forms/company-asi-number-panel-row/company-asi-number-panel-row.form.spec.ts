import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { ProfilePageLocalState } from '../../local-state';
import {
  CompanyAsiNumberPanelRowForm,
  CompanyAsiNumberPanelRowFormModule,
} from './company-asi-number-panel-row.form';

describe('CompanyAsiNumberPanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanyAsiNumberPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      CompanyAsiNumberPanelRowFormModule,
    ],
    providers: [
      mockProvider(ProfilePageLocalState, {
        connect: () => of(this),
        user: {
          AsiNumber: '0000000000',
        },
      }),
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();

    return { spectator, component: spectator.component };
  };
  it('should create', () => {
    //Arrange
    const { spectator, component } = testSetup();

    //Act
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display row title', () => {
    //Arrange
    const { spectator } = testSetup();
    const rowTitle = spectator.query('.settings-main-content');

    //Assert
    expect(rowTitle).toContainText('ASI Number');
  });

  it('should display icon correctly', () => {
    //Arrange
    const { spectator } = testSetup();
    const rowIcon = spectator.query('.form-row-icon');

    //Assert
    expect(rowIcon).toBeVisible();
    expect(rowIcon).toHaveClass('fa fa-hashtag');
  });

  it('should display ASI number', () => {
    //Arrange
    const asiNumber = '99999999999';
    const { spectator, component } = testSetup();

    //Act
    component.state.user.AsiNumber = asiNumber;
    spectator.detectComponentChanges();

    const asiNumberEl = spectator.query('.form-row-value');

    //Assert
    expect(asiNumberEl).toContainText(asiNumber);
  });
});
