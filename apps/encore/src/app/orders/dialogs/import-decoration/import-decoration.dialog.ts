import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem } from '@cosmos/layout';

@Component({
  selector: 'esp-import-decoration',
  templateUrl: './import-decoration.dialog.html',
  styleUrls: ['./import-decoration.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportDecorationDialog {
  menu: NavigationItem[] = [
    {
      id: 'customer',
      title: 'Customer',
      url: [''],
      type: 'item',
      icon: 'fas fa-address-card',
    },
    {
      id: 'decorator',
      title: 'Decorator',
      url: [''],
      type: 'item',
      icon: 'fa fa-stamp',
    },
  ];
}

@NgModule({
  declarations: [ImportDecorationDialog],
  imports: [MatDialogModule, CosButtonModule, CosVerticalMenuModule],
  exports: [ImportDecorationDialog],
})
export class ImportDecorationModule {}
