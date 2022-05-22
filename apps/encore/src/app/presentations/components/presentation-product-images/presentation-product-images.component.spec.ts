import { CosCheckboxChange } from '@cosmos/components/checkbox';
import { PresentationMedia } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationProductImagesComponent,
  PresentationProductImagesComponentModule,
} from './presentation-product-images.component';

const images: PresentationMedia[] = [
  {
    Id: 42964633,
    Type: 'IM',
    Url: 'https://media.asicdn.com/images/jpgo/42960000/42964633.jpg',
    IsPrimary: false,
    IsVisible: true,
    IsAvailable: true,
    Sequence: 0,
    IsVirtualSampleReady: false,
    Attributes: [817249331],
  },
  {
    IsVisible: true,
    Sequence: 5,
    Id: 42964634,
    Type: 'IM',
    Url: 'https://media.asicdn.com/images/jpgo/42960000/42964634.jpg',
    IsPrimary: false,
    IsAvailable: true,
    IsVirtualSampleReady: true,
    Attributes: [817249331],
  },
  {
    IsVisible: true,
    Sequence: 6,
    Id: 42964635,
    Type: 'IM',
    Url: 'https://media.asicdn.com/images/jpgo/42960000/42964635.jpg',
    IsPrimary: false,
    IsAvailable: true,
    IsVirtualSampleReady: false,
    Attributes: [817249330],
  },
  {
    IsVisible: true,
    Sequence: 8,
    Id: 42964637,
    Type: 'IM',
    Url: 'https://media.asicdn.com/images/jpgo/42960000/42964637.jpg',
    IsPrimary: false,
    IsAvailable: true,
    IsVirtualSampleReady: false,
    Attributes: [817249329],
  },
  {
    IsVisible: true,
    Sequence: 9,
    Id: 42964638,
    Type: 'IM',
    Url: 'https://media.asicdn.com/images/jpgo/42960000/42964638.jpg',
    IsPrimary: false,
    IsAvailable: true,
    IsVirtualSampleReady: true,
    Attributes: [817249329],
  },
  {
    IsVisible: true,
    Sequence: 10,
    Id: 42964639,
    Type: 'IM',
    Url: 'https://media.asicdn.com/images/jpgo/42960000/42964639.jpg',
    IsPrimary: false,
    IsAvailable: true,
    IsVirtualSampleReady: false,
    Attributes: [817249328],
  },
];

describe('PresentationProductImagesComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductImagesComponent,
    imports: [PresentationProductImagesComponentModule],
    providers: [],
  });

  const testSetup = (options?: {
    images?: PresentationMedia[];
    uploadedImages?: string[];
  }) => {
    const spectator = createComponent({
      props: {
        images: options?.images ?? [],
        uploadedImages: options?.uploadedImages ?? [],
      },
    });
    return { spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display the image preview list component', () => {
    // Arrange
    const { spectator } = testSetup();
    const imagePreviewListComponent = spectator.query(
      '.presentation-product__img-thumbs'
    );

    // Assert
    expect(imagePreviewListComponent).toBeVisible();
  });

  it("should display the 'Product Image' header", () => {
    // Arrange
    const { spectator } = testSetup();

    const productImageHeader = spectator.query('.header-style-14-bold');
    // Assert
    expect(productImageHeader).toBeVisible();
    expect(productImageHeader).toHaveText('Product Image');
  });

  it('should allow a user to bulk mark all images as visible / hidden', () => {
    // Arrange
    const { component, spectator } = testSetup({ images });
    const showHideCheckbox = spectator.query('.toggle-all-images');
    const showHideCheckboxLabel = spectator.query('.select-all-label');
    const emitSpy = jest.spyOn(component.imagesChange, 'emit');

    // Act
    component.toggleAll({ checked: true } as CosCheckboxChange);

    // Assert
    expect(showHideCheckbox).toBeVisible();
    expect(showHideCheckboxLabel).toHaveText('Show/Hide All');
    expect(emitSpy).toHaveBeenCalledWith([
      ...component.images.map((image) => ({ ...image, IsVisible: true })),
    ]);
    component.images.forEach((image) => {
      expect(image.IsVisible).toBeTruthy();
    });

    // Act again
    component.toggleAll({ checked: false } as CosCheckboxChange);

    // Re-Assert
    expect(emitSpy).toHaveBeenCalledWith([
      ...component.images.map((image) => ({ ...image, IsVisible: false })),
    ]);
    component.images.forEach((image) => {
      expect(image.IsVisible).toBeFalsy();
    });
  });

  it('should display max 4 images by default and hide the rest', () => {
    // Arrange
    const { spectator } = testSetup({ images });
    const imgPreviewCards = spectator.queryAll(
      '.image-upload-card.img-upload-preview--small'
    );

    // Assert
    expect(imgPreviewCards).toBeVisible();
    expect(imgPreviewCards.length).toEqual(4);
  });

  it('should allow a user to view all images', () => {
    // Arrange
    const { spectator } = testSetup({ images });
    const showAllBtn = spectator.query('.img-upload-previews-toggle');

    // Act
    spectator.click(showAllBtn);
    const imageCards = spectator.queryAll('cos-card');

    // Assert
    expect(imageCards.length).toEqual(images?.length);
  });

  it('should allow a user to see less images', () => {
    // Arrange
    const { spectator } = testSetup({ images });
    const toggleAllBtn = spectator.query('.toggle-all-images');
    const showAllBtn = spectator.query('.img-upload-previews-toggle');

    // Act
    spectator.click(showAllBtn);
    let imageCards = spectator.queryAll('cos-card');

    // Assert
    expect(imageCards.length).toEqual(images.length);

    // Act again
    spectator.click(showAllBtn);
    imageCards = spectator.queryAll('cos-card');

    // Re-Assert
    expect(imageCards.length).toEqual(4);
  });

  it('should not have the show more option when there are 4 or less images', () => {
    // Arrange
    const { spectator } = testSetup({ images: images.slice(0, 3) });
    const showAllBtn = spectator.query('.img-upload-previews-toggle');

    // Assert
    expect(showAllBtn).not.toBeVisible();
  });

  it('should allow a user to toggle if a product image is visible / hidden', () => {
    // Arrange
    const { spectator } = testSetup({ images });
    const showHideBtns = spectator.queryAll('cos-card-controls > button');
    const showHideBtnsIcons = spectator.queryAll(
      'cos-card-controls > button > i'
    );

    // Assert
    expect(showHideBtnsIcons[0]).toHaveClass('fa-eye');

    // Act
    spectator.click(showHideBtns[0]);

    // Re-Assert
    expect(showHideBtnsIcons[0]).toHaveClass('fa-eye-slash');
  });

  it('should put the first image that is visible in the array into focus if you set an image current currently in focus as hidden', () => {
    // Arrange
    const { component, spectator } = testSetup({ images });
    const imageToggleVisibiltyBtns = spectator.queryAll('.toggle-visible');
    const emitSpy = jest.spyOn(component.imagesChange, 'emit');
    jest.spyOn(component, 'toggleVisible');

    // Act
    spectator.click(imageToggleVisibiltyBtns[0]);

    // Assert
    expect(component.toggleVisible).toHaveBeenCalledWith(
      component.visibleImages[0]
    );
    expect(emitSpy).toHaveBeenCalledWith(component.images);
  });

  it('should display image in cards', () => {
    // Arrange
    const { spectator } = testSetup({ images });
    const previewImages = spectator.queryAll(
      'div.img-upload-preview-body > div.img-upload-preview-container > img'
    );

    // Assert
    expect(previewImages).toBeVisible();
    previewImages.forEach((image, i) => {
      expect(image.getAttribute('src')).toEqual(images[i].Url);
    });
  });

  it('should display show hide buttons over images correctly', () => {
    // Arrange
    const { spectator } = testSetup({ images });
    const showHideBtns = spectator.queryAll('cos-card-controls > button');
    const showHideBtnsIcons = spectator.queryAll(
      'cos-card-controls > button > i'
    );

    // Assert
    expect(showHideBtns).toBeVisible();
    showHideBtns.forEach((button, i) => {
      expect(button).toHaveDescendant(showHideBtnsIcons[i]);
    });
  });
});
