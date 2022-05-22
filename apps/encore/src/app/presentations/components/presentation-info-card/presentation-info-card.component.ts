import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { FormControl } from '@cosmos/forms';
import { PresentationStatus } from '@esp/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { firstValueFrom } from 'rxjs';
import { ProjectsDialogService } from '../../../projects/services';
import { PresentationLocalState } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-info-card',
  templateUrl: './presentation-info-card.component.html',
  styleUrls: ['./presentation-info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PresentationLocalState],
})
export class PresentationInfoCardComponent {
  presentationPhase = new FormControl(PresentationStatus.PostShare);

  constructor(
    public readonly state: PresentationLocalState,
    private readonly dialogService: ProjectsDialogService
  ) {
    state.connect(this);
  }

  async openEditDialog(): Promise<void> {
    if (!this.state.project) {
      return;
    }

    await firstValueFrom(
      this.dialogService.openProjectEditInfoDialog(this.state.project)
    );
  }
}

@NgModule({
  declarations: [PresentationInfoCardComponent],
  imports: [CommonModule, CosButtonModule, CosCardModule],
  exports: [PresentationInfoCardComponent],
})
export class PresentationInfoCardComponentModule {}
