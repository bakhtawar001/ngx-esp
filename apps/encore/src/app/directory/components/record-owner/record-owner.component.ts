import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { Owner } from '@esp/models';

@Component({
  selector: 'esp-record-owner',
  templateUrl: './record-owner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./record-owner.component.scss'],
})
export class RecordOwnerComponent {
  @Input() owner: Owner;
}

@NgModule({
  declarations: [RecordOwnerComponent],
  imports: [CommonModule, CosAvatarModule, InitialsPipeModule],
  exports: [RecordOwnerComponent],
})
export class RecordOwnerComponentModule {}
