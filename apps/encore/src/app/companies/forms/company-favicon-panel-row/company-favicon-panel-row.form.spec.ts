import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade } from '@esp/auth';
import { FilesService } from '@esp/files';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanyFaviconPanelRowForm,
  CompanyFaviconPanelRowFormModule,
} from './company-favicon-panel-row.form';

const company = CompaniesMockDb.Companies[0];

describe('CompanyFaviconPanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanyFaviconPanelRowForm,
    imports: [CompanyFaviconPanelRowFormModule],
    providers: [
      mockProvider(CompanyDetailLocalState),
      mockProvider(AuthFacade, {
        user: {
          hasRole: (role) => true,
        },
      }),
      mockProvider(FilesService),
      mockProvider(CosToastService),
    ],
  });

  const testSetup = (options?: { isEditable?: boolean }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(CompanyDetailLocalState, <
          Partial<CompanyDetailLocalState>
        >{
          isLoading: false,
          type: 'company',
          connect() {
            return of(this);
          },
          party: {
            ...company,
            IsEditable: options?.isEditable || false,
            IconMediaLink: { FileUrl: null },
          },
        }),
      ],
    });
    const component = spectator.component;
    return { spectator, component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display the favicon row icon', () => {
    // Arrange
    const { spectator } = testSetup();
    const icon = spectator.query('.form-row-icon');

    // Assert
    expect(icon).toExist();
    expect(icon).toHaveClass('fa fa-atom');
  });

  it("should display 'No favicon selected' when no favicon is available", () => {
    // Arrange
    const { spectator } = testSetup();
    const infoText = spectator.query('.form-row-value');

    // Assert
    expect(infoText).toExist();
    expect(infoText).toHaveText('No favicon selected');
  });

  it('When no value is set for the favicon, no image appears', () => {
    // Arrange
    const { spectator } = testSetup();
    const faviconImage = spectator.query('.settings-company-favicon');

    // Assert
    expect(faviconImage).not.toExist();
  });

  it('should display the favicon icon when an icon is selected and saved', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.state.party.IconMediaLink.FileUrl = 'img.jpg';
    spectator.detectComponentChanges();
    const rowIcon = spectator.query('.settings-company-favicon');

    // Assert
    expect(rowIcon).toExist();
    expect(rowIcon.tagName).toBe('IMG');
    expect(rowIcon).toHaveAttribute('src', 'img.jpg');
  });
});
