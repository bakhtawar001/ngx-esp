import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CosToastService } from '@cosmos/components/notification';
import { dataCySelector } from '@cosmos/testing';
import { FilesService } from '@esp/files';
import { MediaLink } from '@esp/models';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import {
  ProfileAvatarPanelRowForm,
  ProfileAvatarPanelRowFormModule,
} from './profile-avatar-panel-row.form';

const selectors = {
  avatarImg: dataCySelector('avatar-img'),
  noPhotoMessage: dataCySelector('no-photo-message'),
  removeIcon: '.fa.fa-trash',
  title: dataCySelector('title'),
  toggleEditButton: dataCySelector('action-button'),
  uploadControl: dataCySelector('upload-control'),
  uploadRecommendation: '.img-upload-reqs-content',
};

describe('ProfileAvatarPanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: ProfileAvatarPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      ProfileAvatarPanelRowFormModule,
    ],
    providers: [mockProvider(FilesService), mockProvider(CosToastService)],
  });

  const testSetup = (options?: { FileUrl?: string }) => {
    const party = {
      IconMediaLink: {
        MediaId: 123,
        FileUrl: options?.FileUrl || null,
      } as MediaLink,
    };
    const stateMock = {
      connect: () =>
        of({
          party: party,
          partyIsReady: true,
        }),
      party: party,
      partyIsReady: true,
    };

    const spectator = createComponent({
      providers: [
        {
          provide: PARTY_LOCAL_STATE,
          useValue: stateMock,
        },
      ],
    });

    const component = spectator.component;

    if (options?.FileUrl) {
      component.control.setValue({ MediaId: 1, FileUrl: options.FileUrl });
    }

    spectator.detectComponentChanges();

    return { spectator, component };
  };

  it('should create', () => {
    const { spectator, component } = testSetup();

    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it("should show 'Profile Photo' as title and 'No photo currently selected' as value", () => {
    const { spectator } = testSetup();
    const title = spectator.query(selectors.title);
    const value = spectator.query(selectors.noPhotoMessage);

    expect(title.textContent).toMatch('Profile Photo');
    expect(value.textContent).toMatch('No photo currently selected');
  });

  it('should display icon correctly', () => {
    const { spectator } = testSetup();
    const icon = spectator.query('.form-row-icon');

    expect(icon).toExist();
    expect(icon).toHaveClass('fas fa-grin-beam');
  });

  it('should display image', () => {
    const { spectator } = testSetup({ FileUrl: 'img.png' });

    const image = spectator.query(selectors.avatarImg);
    expect(image).toBeVisible();
    expect(image).toHaveAttribute('src', 'img.png');
  });

  describe('edit profile photo', () => {
    it('should display profile photo', () => {
      const { spectator } = testSetup({ FileUrl: 'img.png' });

      spectator.click(selectors.toggleEditButton);

      const image = spectator.query(selectors.avatarImg);
      expect(image).toBeVisible();
      expect(image).toHaveAttribute('src', 'img.png');
    });

    describe('remove profile photo', () => {
      it('should display remove icon', () => {
        const { spectator } = testSetup({ FileUrl: 'img.png' });

        spectator.click(selectors.toggleEditButton);

        const removeIcon = spectator.query(selectors.removeIcon);
        expect(removeIcon).toExist();
      });

      it('should remove profile photo', () => {
        const { component, spectator } = testSetup({ FileUrl: 'img.png' });

        spectator.click(selectors.toggleEditButton);

        spectator.click(selectors.removeIcon);

        expect(component.control.dirty).toBeTruthy();
        expect(component.control.value).toBe(null);
      });

      it('should not display remove icon', () => {
        const { component, spectator } = testSetup({ FileUrl: 'img.png' });

        spectator.click(selectors.toggleEditButton);

        component.onRemove();
        spectator.detectComponentChanges();

        const removeIcon = spectator.query(selectors.removeIcon);
        expect(removeIcon).not.toBeVisible();
      });
    });
  });

  describe('image upload', () => {
    it('should display upload image icon', () => {
      const { component, spectator } = testSetup();

      component.control.setValue({ MediaId: 0 });
      spectator.detectComponentChanges();

      spectator.click(selectors.toggleEditButton);

      const uploadIcon = spectator.query('.fa.fa-cloud-upload-alt');
      expect(uploadIcon).toBeVisible();
    });

    it('should display image upload recommendation text', () => {
      const { spectator } = testSetup();

      spectator.click(selectors.toggleEditButton);

      expect(
        spectator.query(selectors.uploadRecommendation).textContent
      ).toMatch(
        'Square images are recommended, all others will be resized automatically. Image should be minimum of 50px X 50px and under 2MB in size'
      );
    });

    describe('upload file', () => {
      it('should be possible to upload only 1 file', () => {
        const { spectator } = testSetup();
        spectator.click(selectors.toggleEditButton);
        spectator.component.control.setValue(null);

        expect(
          spectator
            .query(selectors.uploadControl)
            .getAttribute('ng-reflect-allow-multiple-uploads')
        ).toEqual('false');
      });
      it('should handle successfully upload file', () => {
        const mockFile = {
          uid: '01',
          name: 'filename',
          extension: '.png',
          size: 123000,
          rawFile: 'test raw file',
        };
        const { component, spectator } = testSetup();
        const filesService = spectator.inject(FilesService);
        const uploadFileSpy = jest
          .spyOn(filesService, 'uploadFile')
          .mockReturnValue(
            of(
              new HttpResponse({
                status: 200,
                body: [{ MediaId: 999, FileUrl: 'image.png' }],
              })
            )
          );

        component.onSelected(mockFile as any);

        expect(uploadFileSpy).toHaveBeenCalledWith(mockFile, 'Artwork');
        expect(component.control.dirty).toBeTruthy();
        expect(component.control.value.MediaId).toEqual(999);
      });

      it('should handle upload file failed', () => {
        const mockFile = {
          uid: '01',
          name: 'filename',
          extension: '.png',
          size: 123000,
          rawFile: 'test raw file',
        };
        const { component, spectator } = testSetup();
        const filesService = spectator.inject(FilesService);
        const toastService = spectator.inject(CosToastService);

        const uploadFileSpy = jest
          .spyOn(filesService, 'uploadFile')
          .mockReturnValue(throwError({ status: 500 }));
        const toastErrorSpy = jest.spyOn(toastService, 'error');

        component.onSelected(mockFile as any);

        expect(uploadFileSpy).toHaveBeenCalledWith(mockFile, 'Artwork');
        expect(component.control.dirty).toBeFalsy();
        expect(toastErrorSpy).toHaveBeenCalled();
      });
    });
  });
});
