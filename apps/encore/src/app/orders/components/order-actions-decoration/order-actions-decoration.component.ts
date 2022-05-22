import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OrderDialogService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'esp-order-actions-decoration',
  templateUrl: './order-actions-decoration.component.html',
  styleUrls: ['./order-actions-decoration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderActionsDecorationComponent {
  constructor(private _orderDialogService: OrderDialogService) {}
  importDecoration() {
    this._orderDialogService
      .importDecoration()
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}

@NgModule({
  declarations: [OrderActionsDecorationComponent],
  imports: [CosButtonModule],
  exports: [OrderActionsDecorationComponent],
})
export class OrderActionsDecorationComponentModule {}
