import { MatTooltipModule } from '@angular/material/tooltip';
import {
  fiveAvatars,
  lessThanFiveAvatars,
  moreThanFiveAvatars,
  noAvatarImages,
  teamAvatarImages,
} from '@esp/collections/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosAvatarListComponent } from './avatar-list.component';
import { CosAvatarComponent, CosAvatarModule } from '@cosmos/components/avatar';

describe('CosAvatarListComponent', () => {
  let spectator: Spectator<CosAvatarListComponent>;
  let avatars: any[] = [];
  let component: CosAvatarListComponent;

  const createComponent = createComponentFactory({
    component: CosAvatarListComponent,
    imports: [CosAvatarModule, MatTooltipModule],
    declarations: [CosAvatarListComponent],
  });

  describe('with less than 5 avatars', () => {
    beforeEach(() => {
      avatars = [...lessThanFiveAvatars];
      spectator = createComponent({
        props: {
          avatars,
        },
      });
      component = spectator.component;
    });

    it('avatars should have default size', () => {
      const avatar = spectator.queryAll(CosAvatarComponent);

      expect(avatar).toHaveProperty('size', 'default');
    });

    it('should show list of avatars.', () => {
      const imageTexts = spectator.queryAll('.avatar-image-text');

      expect(spectator.query('.avatar-image')).toHaveAttribute({
        src: avatars[0].imgUrl,
      });
      expect(imageTexts[0]).toHaveText('DL');
    });

    it('Owner should be displayed correctly as collaborator on collection detail page when no additional collaborators exists for a collection, +[number of remaining] should not be displayed.', () => {
      component.avatars = [lessThanFiveAvatars[0]];
      spectator.detectComponentChanges();
      const imageTexts = spectator.queryAll('.avatar-image-text');

      expect(spectator.query('.avatar-image')).toHaveAttribute({
        src: avatars[0].imgUrl,
      });

      expect(imageTexts.length).toBe(1);
      expect(imageTexts[0]).toHaveText('DL');
      const remainingCount = spectator.query('.cos-avatar-remaining-count');

      expect(remainingCount).not.toExist();
    });

    it('should not display +[number of remaining]', () => {
      const remainingCount = spectator.query('.cos-avatar-remaining-count');

      expect(remainingCount).not.toExist();
    });

    it('should have mat-tooltip-trigger.', () => {
      const avatarList = spectator.queryAll(
        'cos-avatar:not(.remaining-item-avatar)'
      );

      expect(avatarList[0]).toHaveClass(['cos-avatar', 'mat-tooltip-trigger']);
    });
  });

  describe('with 5 avatars', () => {
    beforeEach(() => {
      avatars = [...fiveAvatars];
      spectator = createComponent({
        props: {
          avatars,
        },
      });
    });

    it('should display 5 avatars.', () => {
      const avatarList = spectator.queryAll(
        'cos-avatar:not(.remaining-item-avatar)'
      );

      expect(avatarList).toHaveLength(5);
    });

    it('should not display +[number of remaining]', () => {
      const remainingCount = spectator.query('.cos-avatar-remaining-count');

      expect(remainingCount).not.toExist();
    });
  });

  describe('more than five avatars', () => {
    beforeEach(() => {
      avatars = [...moreThanFiveAvatars];
      spectator = createComponent({
        props: {
          avatars,
        },
      });
    });

    it('should display 4 avatars.', () => {
      const avatarList = spectator.queryAll(
        'cos-avatar:not(.remaining-item-avatar)'
      );

      expect(avatarList).toHaveLength(4);
    });

    it('should display +[number of remaining] collaborators', () => {
      const remainingCount = spectator.query('.cos-avatar-remaining-count');

      expect(remainingCount).toExist();
      expect(remainingCount.textContent).toMatch(`+${avatars.length - 4}`);
    });
  });

  describe('with no images', () => {
    beforeEach(() => {
      avatars = [...noAvatarImages];
      spectator = createComponent({
        props: {
          avatars,
        },
      });
    });

    it('should display initials', () => {
      const avatarList = spectator.queryAll('.avatar-image-text');

      expect(avatarList[0]).toHaveText(avatars[0].displayText);
    });
  });

  describe('with team avatars', () => {
    beforeEach(() => {
      avatars = [...teamAvatarImages];
      spectator = createComponent({
        props: {
          avatars,
        },
      });
      component = spectator.component;
    });

    it('should display users icon', () => {
      const avatarList = spectator.queryAll(
        'cos-avatar:not(.remaining-item-avatar)'
      );

      expect(avatarList[0]).toHaveDescendant('i.fa.fa-users');
    });
  });

  describe('re-render', () => {
    beforeEach(() => {
      avatars = [...moreThanFiveAvatars];
      spectator = createComponent({
        props: {
          avatars,
        },
      });
      component = spectator.component;
    });

    it('should not re-render the list of items if there are no list differs', () => {
      // Arrange & act
      const oldItems = spectator.queryAll('.cos-avatar-list-item');
      spectator.component.avatars = [...moreThanFiveAvatars];
      spectator.detectChanges();
      const newItems = spectator.queryAll('.cos-avatar-list-item');
      // Assert
      expect(oldItems.length).toBeGreaterThan(0);
      expect(oldItems.length).toEqual(newItems.length);
      expect(oldItems).toEqual(newItems);
    });
  });

  describe('with small size', () => {
    beforeEach(() => {
      avatars = [...fiveAvatars];
      spectator = createComponent({
        props: {
          avatars,
          size: 'small',
        },
      });
    });

    it('avatars should have small icons', () => {
      const avatar = spectator.queryAll(CosAvatarComponent);

      expect(avatar).toHaveProperty('size', 'small');
    });
  });
});
