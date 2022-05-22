import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  ImageFormControlComponent,
  ImageFormControlComponentModule,
} from './image-form-control.component';

describe('ImageFormControlComponent', () => {
  const createComponent = createComponentFactory({
    component: ImageFormControlComponent,
    imports: [ImageFormControlComponentModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('When image is set', () => {
    it('should display the image as card', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const imageCard = spectator.query('.company-img-preview');

      // Assert
      expect(imageCard).toExist();
      expect(imageCard).toHaveStyle({
        backgroundImage: `url(${component.img})`,
      });
    });

    it("should display the image card's height and width, correctly", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const imageCard = spectator.query('.company-img-preview');

      // Assert
      expect(imageCard).toExist();
      expect(imageCard).toHaveStyle({
        width: component.width,
        height: component.height,
      });
    });

    it('should display a thrash icon button to remove the image', () => {
      // Arrange
      const { spectator } = testSetup();
      const imgRmvBtn = spectator.query('.company-img-preview-body > button');

      // Assert
      expect(imgRmvBtn).toExist();
      expect(imgRmvBtn).toHaveDescendant('.fa.fa-trash');
    });

    it('should remove the image when delete button is clicked', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const imgRmvBtn = spectator.query('.company-img-preview-body > button');
      jest.spyOn(component, 'removeImage');

      // Act
      spectator.click(imgRmvBtn);
      spectator.detectComponentChanges();

      // Assert
      expect(component.removeImage).toHaveBeenCalled();
      expect(component.img).toBeFalsy();
    });
  });

  describe('When image is not set', () => {
    it('should display the upload (cloud) icon', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.img = '';
      spectator.detectComponentChanges();
      const uploadIcon = spectator.query('.cos-dropzone-display > i');

      // Assert
      expect(uploadIcon).toExist();
      expect(uploadIcon).toHaveClass('fa fa-cloud-upload-alt');
    });

    it("should display the upload info text 'Choose image to upload'", () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.img = '';
      spectator.detectComponentChanges();
      const uploadInfoTxt = spectator.query('.cos-dropzone-upload');

      expect(uploadInfoTxt).toExist();
      expect(uploadInfoTxt).toHaveText('Choose image to upload');
    });

    it("should display the upload info text 'or drag and drop here.'", () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.img = '';
      spectator.detectComponentChanges();
      const uploadInfoTxt = spectator.query('.body-style-12');

      // Assert
      expect(uploadInfoTxt).toExist();
      expect(uploadInfoTxt).toHaveText('or drag and drop here.');
    });

    it("should display the upload info text 'Images should be over 50px x 50px and under 512 GB in size.'", () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.img = '';
      spectator.detectComponentChanges();
      const uploadInfoTxt = spectator.queryAll(
        '.company-img-upload-reqs > p'
      )[0];

      // Assert
      expect(uploadInfoTxt).toExist();
      expect(uploadInfoTxt).toHaveText(
        'Images should be over 50px x 50px and under 512 GB in size.'
      );
    });

    it("should display the upload info text 'Allowed file types are .jpg, .png, .gif.'", () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.img = '';
      spectator.detectComponentChanges();
      const uploadInfoTxt = spectator.queryAll(
        '.company-img-upload-reqs > p'
      )[1];

      // Assert
      expect(uploadInfoTxt).toExist();
      expect(uploadInfoTxt).toHaveText(
        'Allowed file types are .jpg, .png, .gif.'
      );
    });
  });
});
