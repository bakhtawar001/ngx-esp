import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Product } from '@smartlink/models';

@Component({
  selector: 'cos-cart-list',
  templateUrl: 'cart-list.component.html',
  styleUrls: ['cart-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCartListComponent {
  @Input() heading = '';
  @Input() products: Product[] = [];
}
