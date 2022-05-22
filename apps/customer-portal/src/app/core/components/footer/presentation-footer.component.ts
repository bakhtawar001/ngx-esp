import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'esp-presentation-footer',
  templateUrl: './presentation-footer.component.html',
  styleUrls: ['./presentation-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PresentationFooterComponent {}

@NgModule({
  declarations: [PresentationFooterComponent],
  imports: [CommonModule],
  exports: [PresentationFooterComponent],
})
export class PresentationFooterComponentModule {}
