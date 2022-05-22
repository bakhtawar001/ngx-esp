import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationPreviewComponent,
  PresentationPreviewComponentModule,
} from './presentation-preview.component';

describe('PresentationPreviewComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationPreviewComponent,
    imports: [PresentationPreviewComponentModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it("should display 'Presentation preview' header", () => {
    // Arrange
    const { spectator } = testSetup();
    const presentationPreviewHeader = spectator.query('.header-style-18.mb-8');

    // Assert
    expect(presentationPreviewHeader).toExist();
    expect(presentationPreviewHeader).toHaveText('Presentation preview');
  });

  it('should display information under the header', () => {
    // Arrange
    const { spectator } = testSetup();
    const headerInfo = spectator.query('.text-shark.mt-0');

    // Assert
    expect(headerInfo).toExist();
    expect(headerInfo).toHaveText(
      'Lorem ipsum dolor sit amet non consectiur adipiscing.'
    );
  });

  it('should display the preview section tabs, correctly', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const previewSectionTabs = spectator.queryAll(
      'mat-button-toggle-group > mat-button-toggle'
    );

    // Assert
    expect(previewSectionTabs).toHaveLength(2);
    expect(previewSectionTabs[0].children[0]).toHaveText(
      component.previewOptions[0].name
    );
    expect(previewSectionTabs[1].children[0]).toHaveText(
      component.previewOptions[1].name
    );
  });

  it('Landing page tab should be selected by default', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const previewSectionTabs = spectator.queryAll(
      'mat-button-toggle-group > mat-button-toggle'
    );

    // Assert
    expect(previewSectionTabs).toHaveLength(2);
    expect(component.selectedView).toEqual(component.previewOptions[0].value);
    expect(previewSectionTabs[0]).toHaveAttribute('ng-reflect-checked');
    expect(previewSectionTabs[1]).not.toHaveAttribute('ng-reflect-checked');
  });

  it('should display the preview correctly', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const previewPane = spectator.query(
      '.presentation-preview-image > .iframe-wrapper > iframe'
    );

    // Assert
    expect(component.selectedView).not.toBeNull();
    expect(previewPane).toBeVisible();
  });

  it('Preview pane should display correct preview', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const previewPane = spectator.query(
      '.presentation-preview-image > .iframe-wrapper > iframe'
    );

    // Assert
    expect(previewPane).toBeVisible();
    expect(previewPane.getAttribute('src')).toEqual(component.selectedView);
  });

  it("should show the placeholder when there is no selected view, with text 'Configure your Presentation and add products to see a preview.'", () => {
    // Arrange
    const { spectator, component } = testSetup();

    // Act
    component.selectedView = null;
    spectator.detectComponentChanges();

    // Assert
    expect(spectator.query('.presentation-preview-placeholder')).toExist();
    expect(spectator.query('.presentation-preview-placeholder')).toHaveText(
      'Configure your Presentation and add products to see a preview.'
    );
  });
});
