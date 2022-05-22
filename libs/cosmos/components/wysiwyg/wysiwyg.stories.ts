import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';
import markdown from './wysiwyg.md';

@Component({
  selector: 'cos-component',
  styleUrls: ['./wysiwyg.scss'],
  template: `<quill-editor></quill-editor>`,
  encapsulation: ViewEncapsulation.None,
})
class CosDemoComponent {}

export default {
  title: 'Composites/WYSIWYG',

  parameters: {
    notes: markdown,
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosDemoComponent],
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      QuillModule.forRoot({
        modules: {
          toolbar: [['bold', 'italic', 'underline', 'strike']],
        },
      }),
    ],
  },
  component: CosDemoComponent,
  props,
});
