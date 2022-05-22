import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { Special } from '@smartlink/models';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-specials',
  templateUrl: './product-specials.component.html',
  styleUrls: ['./product-specials.component.scss'],
})
export class ProductSpecialsComponent {
  @Input() specials: Special[];

  htmlDecode(input) {
    // this is the best way to get the url decoded from the value that suppliers are adding
    const str = new DOMParser().parseFromString(input, 'text/html');
    return str.documentElement.textContent;
  }
}

@NgModule({
  declarations: [ProductSpecialsComponent],
  imports: [CommonModule, CosAttributeTagModule],
  exports: [ProductSpecialsComponent],
})
export class ProductSpecialsComponentModule {}
