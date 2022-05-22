import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { AttributeTag } from './product-card-tags';

@Component({
  selector: 'cos-product-card-tags',
  templateUrl: './product-card-tags.component.html',
  styleUrls: ['./product-card-tags.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductCardTagsComponent {
  @Input() tags!: AttributeTag[];
}
