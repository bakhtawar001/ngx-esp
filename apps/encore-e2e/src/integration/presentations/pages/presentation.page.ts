import { Page } from '@cosmos/cypress';
import { PresentationSettings } from '@esp/models';

const PAGE_OBJECTS = {
  presentationSettings: () => cy.get('esp-presentation-settings').find('span'),
} as const;

export class PresentationPage extends Page<typeof PAGE_OBJECTS> {
  uri;
  constructor() {
    super(PAGE_OBJECTS);
  }

  open(projectId: number, presentationId: number) {
    this.uri = `/projects/${projectId}/presentations/${presentationId}`;

    cy.navigateByUrl(this.uri);
    cy.log(`Opened Presentation Detail Page`);

    return this;
  }

  setSettingState(setting: keyof PresentationSettings, checked: boolean) {
    const header = getSettingLabel(setting);

    PAGE_OBJECTS.presentationSettings()
      .contains(header)
      .parent()
      .then(($el) => {
        const isChecked = $el.find('input').is(':checked');

        if (isChecked !== checked) {
          cy.wrap($el).click();
        }
      });
  }

  static personalNote(input: string) {
    cy.get('textarea').clear().type(input);
    cy.get('.presentation-note-save-btn').click();
    return this;
  }

  static toggleIncludeSignature(input: 'On' | 'Off') {
    return cy
      .get('.presentation-settings-include-signature>cos-toggle')
      .then(($ele) => {
        return new Cypress.Promise((resolve) => {
          if (
            ($ele.is(':checked') && input == 'Off') ||
            (!$ele.is(':checked') && input == 'On')
          ) {
            cy.wrap($ele).click();
            resolve(this);
          }
        });
      })
      .then(() => {
        return this;
      });
  }

  static expirationDate() {
    cy.get('.mat-datepicker-input').click();
  }

  static sharingOptions(input: 'On' | 'Off') {
    cy.get('cos-toggle[data-cy="toggle-allow-product-variants"]').then(
      ($ele) => {
        if (
          (input == 'Off' && $ele.is(':checked')) ||
          (input == 'On' && !$ele.is(':checked'))
        )
          cy.wrap($ele).click();
      }
    );
  }
}

function getSettingLabel(setting: keyof PresentationSettings) {
  switch (setting) {
    case 'ShowProductAdditionalCharges':
      return 'Additional Charges';
    case 'ShowProductCPN':
      return 'Product CPN';
    case 'ShowProductPriceRanges':
      return 'Price Range';
    case 'ShowProductPricing':
      return 'Pricing';
    case 'ShowProductImprintMethods':
      return 'Imprint Options';
    case 'ShowProductColors':
      return 'Product Color';
    case 'ShowProductSizes':
      return 'Product Size';
    case 'ShowProductShape':
      return 'Product Shape';
    case 'ShowProductMaterial':
      return 'Product Material';
  }

  return null;
}
