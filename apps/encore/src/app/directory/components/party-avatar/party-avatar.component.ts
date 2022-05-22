import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';

@Component({
  selector: 'esp-party-avatar',
  templateUrl: './party-avatar.component.html',
  styleUrls: ['./party-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyAvatarComponent {
  @Input() iconUrl: string;
  @Input() iconClass: string;
  @Input() name: string;
  @Input() square = false;

  public imgError = false;

  public onError(event) {
    this.imgError = true;
    event.target.style.display = 'none';
  }
}

@NgModule({
  declarations: [PartyAvatarComponent],
  imports: [CommonModule, CosAvatarModule, InitialsPipeModule],
  exports: [PartyAvatarComponent],
})
export class PartyAvatarComponentModule {}
