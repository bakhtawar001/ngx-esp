import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { Product } from '@smartlink/models';
import { Observable } from 'rxjs';
import { ProductsService } from '../../services';
import { SponsoredProductCardComponentModule } from '../sponsored-product-card';

@Component({
  selector: 'esp-sponsored-product',
  templateUrl: './sponsored-product.component.html',
  styleUrls: ['./sponsored-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsoredProductComponent implements OnChanges {
  @Input() productId!: number;
  @ContentChild(TemplateRef, { static: true }) template?: TemplateRef<any>;

  product$!: Observable<Product>;

  constructor(private productService: ProductsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const productId = changes.productId.currentValue;
    if (productId && productId !== changes.productId.previousValue) {
      this.product$ = this.productService.get(productId);
    }
  }
}

@NgModule({
  declarations: [SponsoredProductComponent],
  imports: [CommonModule, SponsoredProductCardComponentModule],
  exports: [SponsoredProductComponent],
})
export class SponsoredProductComponentModule {}
