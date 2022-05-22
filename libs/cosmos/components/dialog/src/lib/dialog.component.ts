import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CosDialogActionsDirective } from './dialog-actions.directive';
import { CosDialogContentDirective } from './dialog-content.directive';
import { CosDialogHeaderDirective } from './dialog-header.directive';
import { CosDialogSubHeaderDirective } from './dialog-sub-header.directive';

export enum DialogCloseStrategy {
  BACKDROP_CLICK,
  CLOSE,
}

@Component({
  selector: 'cos-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosDialogComponent {
  @Input()
  closeStrategy = DialogCloseStrategy.CLOSE;

  constructor(private readonly dialogRef: MatDialogRef<CosDialogComponent>) {}

  onCloseDialog(): void {
    if (this.closeStrategy === DialogCloseStrategy.BACKDROP_CLICK) {
      this.clickBackdrop();
      return;
    }

    if (this.closeStrategy === DialogCloseStrategy.CLOSE) {
      this.dialogRef.close();
      return;
    }
  }

  private clickBackdrop(): void {
    (document.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();
  }
}

const declarations = [
  CosDialogComponent,
  CosDialogActionsDirective,
  CosDialogContentDirective,
  CosDialogHeaderDirective,
  CosDialogSubHeaderDirective,
];

@NgModule({
  declarations,
  exports: declarations,
  imports: [CommonModule, MatDialogModule],
})
export class CosDialogModule {}
