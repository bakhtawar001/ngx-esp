import { createComponentFactory } from '@ngneat/spectator/jest';
import { CosImageUploadFormComponent } from './image-upload-form.component';
import { CosImageUploadFormModule } from './image-upload-form.module';

describe('ImageUploadFormComponent', () => {
  const createComponent = createComponentFactory({
    component: CosImageUploadFormComponent,
    imports: [CosImageUploadFormModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Asert
    expect(component).toBeTruthy();
  });

  it('should display the upload text appropriately as: Upload / Choose image to upload', () => {
    // Arrange
    const { component, spectator } = testSetup();
    let uploadLabel = spectator.query('.cos-dropzone-upload');

    // Assert
    expect(component.size).toBe(null);
    expect(uploadLabel).toHaveText('Choose image to upload');

    // Act
    spectator.setInput('size', 'sm');
    spectator.detectComponentChanges();
    uploadLabel = spectator.query('.cos-dropzone-upload');

    // Re-Assert
    expect(component.size).toBe('sm');
    expect(uploadLabel).toHaveText('Upload');
  });

  it("should not display the text 'or drag and drop here.', when size = 'sm'", () => {
    // Arrange
    const { spectator } = testSetup();

    // Act
    spectator.setInput('size', 'sm');
    spectator.detectComponentChanges();
    const addtnlText = spectator.query('.body-style-12');

    // Assert
    expect(addtnlText).toHaveText('or drag and drop here.');
    expect(addtnlText).toHaveClass('cos-accessibly-hidden');
  });

  it("should display the text 'Allowed file types are (filetypes) correctly'", () => {
    // Arrange
    const { spectator } = testSetup();

    // Act
    spectator.setInput('acceptedFileTypes', '.jpeg,.jpg,.png');
    spectator.detectComponentChanges();

    // Assert
    expect('.img-upload-reqs').toExist();
    expect('.img-upload-reqs').toHaveText(
      'Allowed file types are .jpeg,  .jpg,  .png'
    );
  });
});
