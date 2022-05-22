/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Presentation } from '@esp/models';
import { standardSetup } from '../../utils';
import { generateProject } from '../project/factories';
import { generatePresentation } from './factories';
import { presentationDetail } from './fixtures';
import { PresentationPage } from './pages/presentation.page';
import { mockPresentations } from './utils';

const fixture = presentationDetail(Cypress.env('environment'));

const page = new PresentationPage();

standardSetup(fixture);

function testSetup(options?: { presentation?: Partial<Presentation> }) {
  const project = generateProject({ Id: 2000 });
  const presentation = generatePresentation({
    Id: 5000,
    ProjectId: project.Id,
    ...options?.presentation,
  });

  mockPresentations.initial(project, presentation);

  page.open(project.Id, presentation.Id);

  cy.wait('@getProjects');
  cy.wait('@getPresentations');

  return { project, presentation };
}

describe('Presentation Settings', () => {
  it('should allow a user to hide/show Product CPN from showing on the customer facing presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductCPN', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductCPN).to.be.false;
    });
  });

  it('should allow a user to hide/show Price Range on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductPriceRanges', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductPriceRanges).to.be.false;
    });
  });

  it('should allow a user to hide/show Pricing & Charges on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductPricing', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductPricing).to.be.false;
    });
  });

  it('should allow a user to hide/show Imprint Options on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductImprintMethods', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductImprintMethods).to.be.false;
    });
  });

  it('should allow a user to hide/show Additional Charges on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductAdditionalCharges', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductAdditionalCharges).to.be.false;
    });
  });

  it('should allow a user to hide/show Product Color on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductColors', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductColors).to.be.false;
    });
  });

  it('should allow a user to hide/show Product Size on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductSizes', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductSizes).to.be.false;
    });
  });

  it('should allow a user to hide/show Product Shape on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductShape', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductShape).to.be.false;
    });
  });

  it('should allow a user to hide/show Product Material on all products in the presentation. ENCORE-3358', () => {
    testSetup();

    page.setSettingState('ShowProductMaterial', false);

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Settings.ShowProductMaterial).to.be.false;
    });
  });

  it('should allow a distributor to enter a personal note. ENCORE-3358', () => {
    testSetup();

    PresentationPage.personalNote('ASI testing').toggleIncludeSignature('On');

    cy.wait('@updatePresenation').then(({ request: { body } }) => {
      expect(body.Note).to.equal('ASI testing');
    });
  });
});
