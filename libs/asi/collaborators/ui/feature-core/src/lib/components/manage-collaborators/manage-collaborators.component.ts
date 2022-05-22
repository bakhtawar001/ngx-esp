import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { InitialsPipe, InitialsPipeModule } from '@cosmos/common';
import { Avatar, CosAvatarListModule } from '@cosmos/components/avatar-list';
import { CosButtonModule } from '@cosmos/components/button';
import { HasWriteAccessPipe, HasWriteAccessPipeModule } from '@esp/auth';
import { Collaborator } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual, sortBy } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { CollaboratorsDialogService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'asi-manage-collaborators',
  templateUrl: './manage-collaborators.component.html',
  styleUrls: ['./manage-collaborators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiManageCollaboratorsComponent implements AfterContentInit {
  // @TODO remove this field and use party.IsEditable only
  @Input()
  canEdit = false;
  @Input()
  isOnlyReadWrite = false;

  avatarList: Avatar[] = [];

  constructor(
    @Inject(PARTY_LOCAL_STATE) public readonly state: PartyLocalState,
    private readonly collaboratorsDialogService: CollaboratorsDialogService,
    private readonly hasWriteAccessPipe: HasWriteAccessPipe,
    private readonly initialsPipe: InitialsPipe
  ) {}

  ngAfterContentInit(): void {
    this.state
      .connect(this)
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map((x) => x.party),
        filter(Boolean),
        distinctUntilChanged(isEqual),
        map(({ Collaborators }) => Collaborators),
        filter(Boolean),
        untilDestroyed(this)
      )
      .subscribe(([owner, ...collaborators]: Collaborator[]) => {
        const sortedCollaborators = sortBy(collaborators, [
          (collaborator) => collaborator.Name.toLocaleUpperCase(),
        ]);

        this.avatarList = [owner, ...sortedCollaborators].map((c) => ({
          imgUrl: c.ImageUrl,
          toolTipText: c.Name,
          displayText: this.initialsPipe.transform(c.Name),
          icon: c.IsTeam ? 'fa-users' : '',
        }));
      });
  }

  async onManageCollaborators(): Promise<void> {
    await firstValueFrom(
      this.collaboratorsDialogService.openManageCollaboratorsDialog({
        entity: this.state.party,
        isOnlyReadWrite: this.isOnlyReadWrite,
      })
    ).then((result) => {
      if (result) {
        this.state.save({
          ...this.state.party,
          AccessLevel: result.AccessLevel,
          Access: result.Access,
          Collaborators: result.Collaborators,
          IsEditable: this.hasWriteAccessPipe.transform(
            this.state.party?.Collaborators,
            this.state.party?.OwnerId
          ),
        });
      }
    });
  }
}

@NgModule({
  imports: [
    CosAvatarListModule,
    CosButtonModule,
    CommonModule,
    HasWriteAccessPipeModule.withProvide(),
    InitialsPipeModule.withProvide(),
  ],
  declarations: [AsiManageCollaboratorsComponent],
  exports: [AsiManageCollaboratorsComponent],
})
export class AsiManageCollaboratorsModule {}
