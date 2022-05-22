import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import markdown from './clearable-input.md';
import { CosClearableInputModule } from './clearable-input.module';

export default {
  title: 'Composites / Clearable Input',
  parameters: {
    notes: markdown,
  },
};

@Component({
  selector: 'cos-input-component',
  template: `
    <cos-clearable-input
      placeholder="Search"
      type="text"
      name="name"
      label="Categories"
    >
    </cos-clearable-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosInputComponent {}

export const primary = () => ({
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      CosClearableInputModule,
      CosFormFieldModule,
      CosInputModule,
      ReactiveFormsModule,
    ],

    declarations: [CosInputComponent],
  },
  component: CosInputComponent,
});
