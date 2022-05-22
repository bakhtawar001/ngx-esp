import { CdkDragMove } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CosCheckboxChange } from '@cosmos/components/checkbox';
import { ProductCard } from './product-card';

type StatusObject = {
  Label: string;
  Icon?: string;
  Color?: string;
  Type?: string;
};
@Component({
  selector: 'cos-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductCardComponent {
  @Input() product!: ProductCard;
  @Input() status?: StatusObject;
  @Input() clientFacing = false;
  @Input() isDraggable = false;
  @Input() isSelectable = true;
  @Input() selectLabel = '';
  @Input() selected = false;
  @Input() suppressActions = false;
  @Input() productActionsTemplate?: TemplateRef<any>;

  @Output()
  readonly selectedChanged = new EventEmitter<ProductCard>();

  @Output()
  readonly dragChanged = new EventEmitter<CdkDragMove>();

  get classModifiers() {
    return `cos-product-card
      ${this.status?.Type ? `cos-product-card--${this.status.Type}` : ''}
      ${this.isDraggable ? 'cos-product-card--draggable' : ''}
      ${this.product.IsDeleted ? 'cos-product-card--disabled' : ''}`;
  }

  onCheckboxChanged(event: CosCheckboxChange) {
    this.selected = event.checked;
    this.selectedChanged.emit(this.product);
  }

  dragMoved(event: CdkDragMove) {
    this.dragChanged.emit(event);
  }
}
