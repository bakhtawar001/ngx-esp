import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosInputModule } from '@cosmos/components/input';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { QuillModule } from 'ngx-quill';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
})
export class TemplatesPage {
  constructor(private _fb: FormBuilder) {}

  templatesForm = this.createTemplatesForm();
  signatureForm = this.createSignatureForm();

  error = false;

  selectOptions = [
    { id: 1, value: "Individual Sender's Email Address 1" },
    { id: 2, value: "Individual Sender's Email Address 2" },
    { id: 3, value: "Individual Sender's Email Address 3" },
    { id: 4, value: "Individual Sender's Email Address 4" },
  ];

  restoreDefaults(key: string) {
    console.log(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  switchToAdmin() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  restoreApplicationdefaults() {}

  protected createSignatureForm() {
    return this._fb.group({
      body: [
        '<p><strong>John Jingleheimer-Schmidt</strong> <br/></p><p>Kraftwerk <br/></p><p>123 Anything St, Anytown, US <br/></p><p>12345 321-555-1234 <br/></p><p>www.kraftwerk.com <br/></p><p><a href="http://localhost:4200/#" rel="noopener noreferrer" target="_blank" style="color: rgb(255, 153, 0);">Twitter</a> | <a href="http://localhost:4200/#" rel="noopener noreferrer" target="_blank" style="color: rgb(255, 153, 0);">Facebook</a> | <a href="http://localhost:4200/#" rel="noopener noreferrer" target="_blank" style="color: rgb(255, 153, 0);">Instagram</a></p>',
      ],
    });
  }

  protected createTemplatesForm() {
    return this._fb.group({
      replyTo: ["Individual Sender's Email Address 1"],
      subject: [
        'New Order Acknowledgement {{Order.number}} from {{CompanyProfile.Name}}',
      ],
      body: [
        'Hello, Thank you for your business. Please sign this Order Acknowledgement. We appreciate your business and look forward to working with you again soon.',
      ],
    });
  }
}

@NgModule({
  declarations: [TemplatesPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    QuillModule,

    CosButtonModule,
    CosCardModule,
    CosInputModule,
    CosSegmentedPanelModule,

    AsiPanelEditableRowModule,
  ],
})
export class TemplatesPageModule {}
