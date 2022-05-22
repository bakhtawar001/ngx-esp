import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosTableModule } from '@cosmos/components/table';
import { CosModalExampleComponent } from './modal-example.component';

@NgModule({
  declarations: [CosModalExampleComponent],
  imports: [CosTableModule, CdkTableModule, MatDialogModule, CosButtonModule],
  exports: [CosModalExampleComponent],
  entryComponents: [CosModalExampleComponent],
})
export class CosModalExampleModule {}
