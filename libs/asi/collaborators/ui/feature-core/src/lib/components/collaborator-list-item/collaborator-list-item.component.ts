import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { AccessType, Collaborator } from '@esp/models';

type Option = { Name: string; Description: string };
const accessTypes: Record<AccessType, Option> = {
  ReadWrite: {
    Name: 'Can edit',
    Description: 'Can edit, but not share with others.',
  },
  Read: {
    Name: 'Can view',
    Description: 'Cannot edit or share with others.',
  },
};

@Component({
  selector: 'asi-collaborator-list-item',
  templateUrl: './collaborator-list-item.component.html',
  styleUrls: ['./collaborator-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCollaboratorListItemComponent {
  @Input() collaborator!: Collaborator;
  @Input() isOnlyReadWrite!: boolean;
  @Input() ownerId!: number;

  @Output() visibilityChanged = new EventEmitter<AccessType>();
  @Output() removeCollaborator = new EventEmitter<void>();

  readonly accessTypes = accessTypes;
  readonly unsorted = () => 0;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  imgError(event): void {
    event.target.style.display = 'none';
  }
}

@NgModule({
  declarations: [AsiCollaboratorListItemComponent],
  imports: [
    CommonModule,
    CosAttributeTagModule,
    CosAvatarModule,
    CosButtonModule,
    MatMenuModule,
    InitialsPipeModule,
  ],
  exports: [AsiCollaboratorListItemComponent],
})
export class AsiCollaboratorListItemComponentModule {}
