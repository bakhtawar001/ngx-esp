import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  OnInit,
  Input,
} from '@angular/core';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { Customer } from '@esp/models';

enum ProjectCustomerIconType {
  Avatar = 'Avatar',
  Icon = 'Icon',
}

@Component({
  selector: 'asi-company-avatar',
  templateUrl: './company-avatar.component.html',
  styleUrls: ['./company-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCompanyAvatarComponent implements OnInit {
  @Input()
  customer!: Customer;
  @Input()
  showAvatarIcon = false;
  @Input()
  iconSize = 26;

  iconType!: ProjectCustomerIconType;

  readonly ProjectCustomerIconType = ProjectCustomerIconType;

  ngOnInit(): void {
    this.iconType = this.customer.IconImageUrl
      ? ProjectCustomerIconType.Avatar
      : ProjectCustomerIconType.Icon;
  }
}

@NgModule({
  imports: [CommonModule, CosAvatarModule],
  declarations: [AsiCompanyAvatarComponent],
  exports: [AsiCompanyAvatarComponent],
})
export class AsiCompanyAvatarModule {}
