import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosInlineEditComponent } from './inline-edit.component';
import { CosInlineEditModule } from './inline-edit.module';

describe('CosInlineEditComponent', () => {
  let spectator: Spectator<CosInlineEditComponent>;
  const inputType = 'text';
  const required = false;
  const maxLength = 100;
  const createComponent = createComponentFactory({
    component: CosInlineEditComponent,
    imports: [CosInlineEditModule],
  });

  describe('Create Inline', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: {
          inputType,
          required,
          maxLength,
        },
      });
    });

    it('should exist', () => {
      expect(spectator).toBeTruthy();
      expect(spectator.query('.cos-inline-edit')).toBeTruthy();
    });
  });
});
