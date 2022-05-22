import { HttpResponse } from '@angular/common/http';
import { CosToastService } from '@cosmos/components/notification';
import { FilesService } from '@esp/files';
import { MediaLink } from '@esp/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import {
  EspImageUploadForm,
  EspImageUploadFormModule,
} from './image-upload.form';

describe('EspImageUploadForm', () => {
  let spectator: Spectator<EspImageUploadForm>;
  let component: EspImageUploadForm;

  const createComponent = createComponentFactory({
    component: EspImageUploadForm,
    imports: [EspImageUploadFormModule],
    providers: [mockProvider(CosToastService), mockProvider(FilesService)],
  });

  const testSetup = () => {
    spectator = createComponent();
    component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display image if image is selected and not display text for describing file criteria', () => {
    // Arrange
    const { spectator, component } = testSetup();
    const mockFile = {
      uid: '01',
      name: 'filename',
      extension: '.png',
      size: 123000,
      rawFile: 'test raw file',
    };

    const describingTextContainer1 = spectator.query('.img-upload-reqs');
    expect(describingTextContainer1).toBeVisible();
    const filesService = spectator.inject(FilesService);
    const uploadFileSpy = jest
      .spyOn(filesService, 'uploadFile')
      .mockReturnValue(
        of(new HttpResponse({ body: [{ MediaId: 123, FileUrl: 'img.jpg' }] }))
      );

    //Act
    component.fileType = 'Artwork';
    component.onSelected(mockFile);
    spectator.detectChanges();
    const img = spectator.query('.settings-company-logo');
    const describingTextContainer = spectator.query('.img-upload-reqs');

    //Assert
    expect(uploadFileSpy).toHaveBeenCalled();
    expect(uploadFileSpy).toHaveBeenCalledWith(mockFile, 'Artwork');
    expect((component.control.value as MediaLink).MediaId).toEqual(123);
    expect(component.control.dirty).toBeTruthy();
    expect(img).toBeVisible();
    expect(img).toHaveAttribute('src', 'img.jpg');
    expect(describingTextContainer).not.toBeVisible();
  });

  it('should display image upload form container if image is not selected ', () => {
    //Arrange
    const { component, spectator } = testSetup();

    //Act
    component.control.setValue(null);
    const imageUploadContainer = spectator.query(
      'cos-image-upload-form > .img-upload-container'
    );
    //Assert
    expect(imageUploadContainer).toBeVisible();
  });

  it('should display upload info', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.control.setValue(null);
    spectator.setInput('maxFileBytes', 2097152);
    spectator.detectComponentChanges();
    const uploadInfoText = spectator.query('.img-upload-reqs-content');

    // Assert
    expect(uploadInfoText).toExist();
  });

  describe('Edit', () => {
    beforeEach(() => {
      testSetup();
      component.control.setValue(<any>{ MediaId: 0, ImageUrl: 'img.jpg' });
      spectator.detectComponentChanges();
    });

    it('should show delete button on top right corner of image on edit', () => {
      // Arrange
      const deleteButton = spectator.query('.cos-icon-button.cos-warn');

      // Assert
      expect(deleteButton).toBeVisible();
    });

    it('should be dirty and null on remove', () => {
      // Arrange
      const saveButton: HTMLButtonElement = spectator.query(
        '.settings-controls > button[type="submit"]'
      );

      // Act
      component.remove();
      spectator.detectChanges();

      // Assert
      expect(component.control.dirty).toBeTruthy();
      expect(component.control.value).toBeNull();
    });
  });
});
