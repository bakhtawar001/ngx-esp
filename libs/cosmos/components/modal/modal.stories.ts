import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosButtonModule } from '@cosmos/components/button';
import { CosModalExampleComponent } from './modal-example.component';
import { CosModalExampleModule } from './modal-example.module';
import markdown from './modal.md';

@Component({
  selector: 'cos-modal-demo',
  template: `
    <button cos-flat-button color="primary" (click)="openModal()">
      Open Modal
    </button>
  `,
})
class CosModalDemoComponent {
  constructor(public dialog: MatDialog) {}

  openModal() {
    this.dialog.open(CosModalExampleComponent);
  }
}

export default {
  title: 'Overlays/Modal',
  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [CosModalDemoComponent],
    imports: [
      BrowserAnimationsModule,
      MatDialogModule,
      CosModalExampleModule,
      CosButtonModule,
    ],
  },
  component: CosModalDemoComponent,
});
