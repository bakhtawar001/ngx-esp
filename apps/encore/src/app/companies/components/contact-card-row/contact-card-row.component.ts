import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AsiPanelEditableRowModule,
  AsiDisplayPrimaryEmailPipeModule,
  AsiDisplayPrimaryPhonePipeModule,
} from '@asi/ui/feature-core';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosPillModule } from '@cosmos/components/pill';
import { LinkRelationship } from '@esp/models';
import { PartyAvatarComponentModule } from '../../../directory/components/party-avatar';

@Component({
  selector: 'esp-contact-card-row',
  templateUrl: './contact-card-row.component.html',
  styleUrls: ['./contact-card-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCardRowComponent {
  @Input()
  link: LinkRelationship;

  @Input()
  contactType: string;
}

@NgModule({
  declarations: [ContactCardRowComponent],
  imports: [
    CommonModule,
    RouterModule,

    CosFormFieldModule,
    CosAvatarModule,
    CosPillModule,
    CosButtonModule,

    InitialsPipeModule,
    AsiPanelEditableRowModule,
    PartyAvatarComponentModule,
    AsiDisplayPrimaryPhonePipeModule,
    AsiDisplayPrimaryEmailPipeModule,
  ],
  exports: [ContactCardRowComponent],
})
export class ContactCardRowModule {}
