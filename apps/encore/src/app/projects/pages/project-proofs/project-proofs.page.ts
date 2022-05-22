import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosImageUploadFormModule } from '@cosmos/components/image-upload-form';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-project-proofs',
  templateUrl: './project-proofs.page.html',
  styleUrls: ['./project-proofs.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectProofsPage {}

@NgModule({
  declarations: [ProjectProofsPage],
  imports: [
    CommonModule,
    CosCardModule,
    CosImageUploadFormModule,
    CosCardModule,
    MatMenuModule,
    MatDatepickerModule,
    CosButtonModule,
  ],
})
export class ProjectProofsPageModule {}
