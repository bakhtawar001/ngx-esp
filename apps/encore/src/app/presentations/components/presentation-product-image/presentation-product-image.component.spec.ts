import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationProductImageComponent,
  PresentationProductImageComponentModule,
} from './presentation-product-image.component';

const image =
  'https://4.imimg.com/data4/BB/RH/MY-15241145/multimedia-mobile-phone-500x500.jpg';

describe('PresentationProductImageComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductImageComponent,
    imports: [PresentationProductImageComponentModule],
    providers: [],
  });

  const testSetup = (options?: { image?: string }) => {
    const spectator = createComponent({
      props: {
        image: options?.image ?? null,
      },
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('When image is not present', () => {
    it("should display the text 'No images selected'", () => {
      // Arrange
      const { spectator } = testSetup();
      const noImgText = spectator.query('.text-center');

      // Assert
      expect(noImgText).toBeVisible();
      expect(noImgText).toHaveText('No images selected');
    });

    it('should display the image upload component to upload image', () => {
      // Arrange
      const { spectator } = testSetup();
      const imgUploadComponent = spectator.query('cos-image-upload-form');

      // Assert
      expect(imgUploadComponent).toBeVisible();
    });

    it("should display the image description as 'Images should be over 110px x 110px and under 10 MB in size.'", () => {
      // Arrange
      const { spectator } = testSetup();
      const imgDescription = spectator.query('.img-upload-reqs-content');

      // Assert
      expect(imgDescription).toBeVisible();
      expect(imgDescription).toHaveText(
        'Images should be over 110px x 110px and under 10 MB in size.'
      );
    });
  });

  describe('When image is present', () => {
    it('should display the first visible image', () => {
      // Arrange
      const { spectator } = testSetup({ image });
      const productImage = spectator.query('.presentation-product-img');

      // Assert
      expect(productImage).toBeVisible();
    });

    // Button text is Delete for Edit Button, change afterwards
    it("should display the Edit button correctly with text 'Delete'", () => {
      // Arrange
      const { spectator } = testSetup({ image });
      const editBtn = spectator.query('.presentation-product-img-edit');
      const editBtnIcon = spectator.query('.presentation-product-img-edit > i');

      // Assert
      expect(editBtn).toBeVisible();
      expect(editBtn.tagName).toBe('BUTTON');
      expect(editBtn).toHaveText('Delete');
      expect(editBtn).toHaveDescendant(editBtnIcon);
      expect(editBtnIcon).toHaveClass('fa fa-pencil-ruler');
    });

    it("should display the Delete button correctly with text 'Delete'", () => {
      // Arrange
      const { spectator } = testSetup({ image });
      const deleteBtn = spectator.query('.presentation-product-img-delete');
      const deleteBtnIcon = spectator.query(
        '.presentation-product-img-delete > i'
      );

      // Assert
      expect(deleteBtn).toBeVisible();
      expect(deleteBtn.tagName).toBe('BUTTON');
      expect(deleteBtn).toHaveText('Delete');
      expect(deleteBtn).toHaveDescendant(deleteBtnIcon);
      expect(deleteBtnIcon).toHaveClass('fa fa-trash-alt');
    });
  });
});
