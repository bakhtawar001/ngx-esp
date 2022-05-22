import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CosButtonGroupModule } from '@cosmos/components/button-group';
import { CosCardModule } from '@cosmos/components/card';

@Component({
  selector: 'esp-presentation-preview',
  templateUrl: './presentation-preview.component.html',
  styleUrls: ['./presentation-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationPreviewComponent {
  constructor(public sanitizer: DomSanitizer) {}

  previewOptions = [
    {
      name: 'Landing Page',
      value: 'https://asi-customer-portal.netlify.app/',
    },
    {
      name: 'Product Page',
      value: 'https://asi-customer-portal.netlify.app/product',
    },
  ];

  selectedView = this.previewOptions[0].value;

  updatePreview(event) {
    this.selectedView = event.value;
  }
}

@NgModule({
  declarations: [PresentationPreviewComponent],
  imports: [CommonModule, CosButtonGroupModule, CosCardModule],
  exports: [PresentationPreviewComponent],
})
export class PresentationPreviewComponentModule {}
