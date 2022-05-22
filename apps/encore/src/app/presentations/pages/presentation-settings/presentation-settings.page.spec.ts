import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { fakeAsync } from '@angular/core/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Presentation, PresentationStatus } from '@esp/models';
import { PresentationMockDb } from '@esp/__mocks__/presentations';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { format } from 'date-fns';
import { MockComponents } from 'ng-mocks';
import { of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  PresentationProductsComponent,
  PresentationProductsComponentModule,
} from '../../components';
import { PresentationLocalState } from '../../local-states';
import { MOCK_PRODUCT } from '../../mock_data/product_data.mock';
import {
  PresentationSettingsPage,
  PresentationSettingsPageModule,
} from './presentation-settings.page';

describe('PresentationSettingsPage', () => {
  const createComponent = createComponentFactory({
    component: PresentationSettingsPage,
    imports: [RouterTestingModule, PresentationSettingsPageModule],
    providers: [mockProvider(Store, { select: () => of('test') })],
    overrideModules: [
      [
        PresentationProductsComponentModule,
        {
          set: {
            declarations: MockComponents(PresentationProductsComponent),
            exports: MockComponents(PresentationProductsComponent),
          },
        },
      ],
    ],
  });

  // We'd want to simulate the "await" behavior for the HTTP response.
  const possibleHttpTimeout = 100;

  const testSetup = (options?: {
    presentation?: Presentation;
    isLoading?: boolean;
    hasLoaded?: boolean;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(PresentationLocalState, {
          presentation:
            options?.presentation || PresentationMockDb.presentation,
          isLoading: options?.isLoading ?? false,
          hasLoaded: options?.hasLoaded ?? true,
          connect() {
            return of(this);
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          updateStatus: () => {},
          save(this: PresentationLocalState, presentation: Presentation) {
            // Carataker note: we're doing this because the `save()` method is used differently within
            // the `presentation-settings.page`. It's used as "fire & forget" and "fire & wait".
            const presentation$ = new Subject<Presentation>();
            setTimeout(() => {
              presentation$.next(presentation);
              this.presentation = presentation;
            }, possibleHttpTimeout);
            return presentation$.pipe(take(1));
          },
        }),
      ],
    });
    return {
      spectator,
      component: spectator.component,
      state: spectator.component.state,
      loader: TestbedHarnessEnvironment.loader(spectator.fixture),
    };
  };

  const statuses = Object.values(PresentationStatus);

  describe('Skeleton loader', () => {
    it('should show the skeleton before the presentation is loaded', () => {
      // Arrange & act
      const { spectator } = testSetup({
        hasLoaded: false,
        isLoading: true,
      });
      // Assert
      expect(spectator.query('esp-presentation-settings-loader')).toExist();
    });

    it('should render the presentation settings page when the presentation is loaded', () => {
      // Arrange & act
      const { spectator } = testSetup();
      // Assert
      expect(spectator.query('esp-presentation-settings-loader')).not.toExist();
      expect(spectator.query('.project__pg-title')).toExist();
    });
  });

  describe('Presentation status', () => {
    it('should render presentation status buttons', () => {
      // Arrange
      const { spectator } = testSetup();
      // Act
      const matButtonToggles = spectator.queryAll(
        '.project__pg-title mat-button-toggle'
      );
      // Assert
      expect(matButtonToggles.length).toEqual(statuses.length);
      matButtonToggles.forEach((matButtonToggle, index) => {
        expect(matButtonToggle.querySelector('button').innerHTML).toHaveText(
          statuses[index]
        );
      });
    });

    describe('PreShare', () => {
      it('should show empty state actions for the PreShare status', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PreShare;
        spectator.detectComponentChanges();
        // Assert
        expect(spectator.query('esp-pres-empty-state-actions')).toExist();
        expect(
          spectator.query('esp-pres-post-share-state-actions')
        ).not.toExist();
      });
      it('Should display the Preview button in a disabled state until at least one visible product is in the presentation.', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PreShare;
        spectator.detectComponentChanges();
        // Assert
        expect(state.presentation.Products.length).toEqual(0);
        const previewButton = spectator.query(
          'esp-pres-empty-state-actions > button.cos-stroked-button'
        );
        expect(previewButton).toExist();
        expect(previewButton).toBeDisabled();
      });

      it('Should display the preview button in an enabled state once at least one visible product is in the presentation', () => {
        // Arrange
        const { spectator, state } = testSetup({
          presentation: {
            ...PresentationMockDb.presentation,
            Products: Array(1).fill(MOCK_PRODUCT),
          },
        });
        // Act
        state.presentation.Status = PresentationStatus.PreShare;
        spectator.detectComponentChanges();
        // Assert
        expect(state.presentation.Products.length).toEqual(1);
        const previewButton = spectator.query(
          'esp-pres-empty-state-actions > button.cos-stroked-button'
        );
        expect(previewButton).toExist();
        expect(previewButton).not.toBeDisabled();
      });

      it('Should display the share button as a primary green button with the text “Share with Customer”', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PreShare;
        spectator.detectComponentChanges();
        // Assert
        const shareButton = spectator.queryAll(
          'esp-pres-empty-state-actions > button'
        )?.[1];
        //TODO: To change text to "Share with Customer" after code change
        expect(shareButton).toHaveText('Share with customer');
      });

      it('should show presentation settings and presentation preview', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PreShare;
        spectator.detectComponentChanges();
        // Assert
        expect(spectator.query('.proj-pres__settings')).toExist();
        expect(spectator.query('esp-presentation-preview')).toExist();
      });
    });

    describe('PostShare', () => {
      it('should show post state actions for the PostShare status', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PostShare;
        spectator.detectComponentChanges();
        // Assert
        expect(spectator.query('esp-pres-post-share-state-actions')).toExist();
        expect(spectator.query('esp-pres-empty-state-actions')).not.toExist();
      });

      it('should show post state actions for the PostShare status but create quote should be disabled', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PostShare;
        spectator.detectComponentChanges();
        const createQuoteButton = spectator.query(
          byText('Create Quote', {
            selector: 'esp-pres-post-share-state-actions button:nth-child(4)',
          })
        );
        // Assert
        expect(createQuoteButton.hasAttribute('disabled')).toBe(true);
      });

      it('Should display the share button as secondary white button with the text “Share”', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PostShare;
        spectator.detectComponentChanges();
        const shareButton = spectator.query(
          byText('Share', {
            selector: 'esp-pres-post-share-state-actions button:nth-child(3)',
          })
        );

        // Assert
        expect(shareButton).toHaveClass(['cos-stroked-button', 'cos-primary']);
        expect(shareButton).toHaveAttribute('color', 'primary');
        expect(shareButton).toHaveDescendant('i.fa.fa-share');
      });

      it('Should display the Edit button once a presentation has been shared', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.PostShare;
        spectator.detectComponentChanges();
        const editButton = spectator.query(
          byText('Edit', {
            selector: 'esp-pres-post-share-state-actions button:nth-child(1)',
          })
        );

        // Assert
        expect(editButton).toHaveClass(['cos-stroked-button', 'cos-primary']);
        expect(editButton).toHaveAttribute('color', 'primary');
        expect(editButton).toHaveDescendant('i.fa.fa-pen');
      });
    });

    describe('QuoteRequested', () => {
      const createQuoteButtonSelector = byText('Create Quote', {
        selector: 'esp-pres-post-share-state-actions button:nth-child(4)',
      });

      it('should show post state actions for the QuoteRequested status but create quote should be enabled', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.QuoteRequested;
        spectator.detectComponentChanges();
        const createQuoteButton = spectator.query(createQuoteButtonSelector);
        // Assert
        expect(createQuoteButton.hasAttribute('disabled')).toBe(false);
      });

      it('should show quote requests', () => {
        // Arrange
        const { spectator, state } = testSetup();
        // Act
        state.presentation.Status = PresentationStatus.QuoteRequested;
        spectator.detectComponentChanges();
        const createQuoteButton = spectator.query(createQuoteButtonSelector);
        spectator.click(createQuoteButton);
        // Assert
        expect(spectator.query('esp-pres-quote-request')).toExist();

        // Should be more tests there, but `esp-pres-quote-request` is a placeholder component now.
      });
    });
  });

  describe('Presentation settings', () => {
    it('should display tootltip on presentation settings info icon', async () => {
      const { loader } = testSetup();
      const tooltips = await loader.getAllHarnesses(MatTooltipHarness);
      expect(tooltips.length).toBe(1);

      await tooltips[0].show();

      expect(await tooltips[0].getTooltipText()).toEqual(
        'Hiding a product detail here will apply to all products in the presentation. You can choose to display the hidden information for specific items by editing the individual product and turning the option on.'
      );
    });

    it('should display presentation settings description', () => {
      const { spectator } = testSetup();
      const description = spectator.query('.proj-pres__settings-description');
      expect(description.textContent.trim()).toEqual(
        'Hide these product details on all items in your presentation.'
      );
    });

    it('should render presentation settings when the presentation has the PreShare status', () => {
      // Arrange
      const { spectator, component } = testSetup();
      // Act
      component.state.presentation.Status = PresentationStatus.PreShare;
      spectator.detectComponentChanges();
      // Assert
      expect(
        spectator.query('.proj-pres__settings cos-card.presentation-settings')
      ).toExist();
    });

    describe('Sharing options', () => {
      it('should disable allow products variants when it is being updated and then enable it', fakeAsync(() => {
        // Arrange
        const { spectator, state } = testSetup();
        const toggle = spectator.query(
          '[data-cy=toggle-allow-product-variants]'
        );
        const checkbox = toggle.querySelector('.cos-slide-toggle-input');
        // Act
        spectator.click(toggle);
        // Assert
        expect(checkbox.hasAttribute('disabled')).toEqual(true);
        spectator.tick(possibleHttpTimeout);
        spectator.detectComponentChanges();
        expect(checkbox.hasAttribute('disabled')).toEqual(false);
        expect(state.presentation.AllowProductVariants).toEqual(true);
      }));

      it('should allow a distributor to enter a personal note', () => {
        // Arrange
        const { spectator } = testSetup();
        const personalNoteInput = spectator.query('#sharing-personal-note');

        // Assert
        expect(personalNoteInput).toBeVisible();
        expect(personalNoteInput.tagName).toBe('TEXTAREA');
      });

      it('should be able to cancel the inputted note', () => {
        // Arrange
        const { spectator, component, state } = testSetup();
        const textarea = spectator.query<HTMLTextAreaElement>(
          '#sharing-personal-note'
        );
        const saveSpy = jest.spyOn(state, 'save');
        const resetNoteSpy = jest.spyOn(component, 'resetNote');
        const cancelButton = spectator.query('.presentation-note-cancel-btn');
        // Act
        textarea.value = 'Some test note';
        textarea.dispatchEvent(new KeyboardEvent('input'));
        spectator.detectComponentChanges();
        // Assert
        expect(component.tempForm.value).toEqual({
          Note: 'Some test note',
          ExpirationDate: null,
        });
        spectator.click(cancelButton);
        expect(saveSpy).not.toHaveBeenCalled();
        expect(resetNoteSpy).toHaveBeenCalled();
        expect(component.tempForm.value).toEqual({
          Note: null,
          ExpirationDate: null,
        });
      });

      it('should display the correct count of words when Personal note input is populated with words', fakeAsync(() => {
        // Arrange
        const { spectator } = testSetup();
        let textarea = spectator.query<HTMLTextAreaElement>(
          '#sharing-personal-note'
        );

        // Act
        spectator.typeInElement('test', textarea);
        spectator.tick(possibleHttpTimeout);
        const wordCountArea = spectator.query('cos-hint');
        textarea = spectator.query<HTMLTextAreaElement>(
          '#sharing-personal-note'
        );

        // Assert
        expect(wordCountArea.innerHTML).toEqual(
          `${textarea.value.length}/${textarea.getAttribute('maxlength')}`
        );
      }));

      it('should save the note when the save note button is clicked', fakeAsync(() => {
        // Arrange
        const { spectator, component, state } = testSetup();
        const textarea = spectator.query<HTMLTextAreaElement>(
          '#sharing-personal-note'
        );
        const saveSpy = jest.spyOn(state, 'save');
        const saveNoteSpy = jest.spyOn(component, 'saveNote');
        const saveNoteButton = spectator.query('.presentation-note-save-btn');
        // Act
        textarea.value = 'Some test note';
        textarea.dispatchEvent(new KeyboardEvent('input'));
        spectator.detectComponentChanges();
        // Assert
        expect(component.tempForm.value).toEqual({
          Note: 'Some test note',
          ExpirationDate: null,
        });
        spectator.click(saveNoteButton);
        spectator.tick(possibleHttpTimeout);
        expect(saveSpy).toHaveBeenCalled();
        expect(saveNoteSpy).toHaveBeenCalled();
        expect(state.presentation.Note).toEqual('Some test note');
      }));

      it('should disable include signature when it is being updated and then enable it', fakeAsync(() => {
        // Arrange
        const { spectator, component } = testSetup();
        const toggle = spectator.query('[data-cy=toggle-include-signature]');
        const checkbox = toggle.querySelector('.cos-slide-toggle-input');
        // Act
        spectator.click(toggle);
        // Assert
        expect(checkbox.hasAttribute('disabled')).toEqual(true);
        spectator.tick(possibleHttpTimeout);
        spectator.detectComponentChanges();
        expect(checkbox.hasAttribute('disabled')).toEqual(false);
        expect(component.state.presentation.ShowSignature).toEqual(true);
      }));

      it("should have correct placeholder as 'Select a date' in the expiration date input", fakeAsync(() => {
        // Arrange
        const { spectator } = testSetup();
        const dateInput = spectator.query<HTMLInputElement>(
          '[data-cy=expiration-date-input]'
        );

        // Assert
        expect(dateInput.getAttribute('placeholder')).toEqual('Select a date');
      }));

      it('should save the expiration date when the input is blurred', fakeAsync(() => {
        // Arrange
        const { spectator, component, state } = testSetup();
        const expirationDate = format(new Date(), `yyyy-MM-dd'T'hh:mm:ss`);
        const saveSpy = jest.spyOn(state, 'save');
        const saveExpirationDateSpy = jest.spyOn(
          component,
          'saveExpirationDate'
        );
        const input = spectator.query<HTMLInputElement>(
          '[data-cy=expiration-date-input]'
        );
        // Act
        component.tempForm.controls.ExpirationDate.setValue(expirationDate);
        // Caretaker note: `spectator.blur()` calls `input.blur()` internally, but that's not the same as
        // `dispatchEvent(new FocusEvent('blur'))`. `HTMLElement.blur()` doesn't run event listeners added
        // via `addEventListener()`.
        input.dispatchEvent(new FocusEvent('blur'));
        spectator.detectComponentChanges();
        spectator.tick(possibleHttpTimeout);
        // Assert
        expect(saveSpy).toHaveBeenCalled();
        expect(saveExpirationDateSpy).toHaveBeenCalled();
        expect(state.presentation.ExpirationDate).toBe(expirationDate);
      }));

      it('should by empty if no expiration date is selected', () => {
        // Arrange
        const { spectator } = testSetup();
        const input = spectator.query<HTMLInputElement>(
          '[data-cy=expiration-date-input]'
        );

        // Assert
        expect(input.valueAsDate).toBeNull();
      });
    });
  });
});
