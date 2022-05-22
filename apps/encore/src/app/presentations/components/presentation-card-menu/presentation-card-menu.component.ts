import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { PresentationSearch } from '@esp/models';
import { firstValueFrom } from 'rxjs';
import { PresentationsDialogService } from '../../services';

@Component({
  selector: 'esp-presentation-card-menu',
  templateUrl: './presentation-card-menu.component.html',
  styleUrls: ['./presentation-card-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationCardMenuComponent {
  @Input() presentation: PresentationSearch;

  constructor(
    private readonly _dialogService: PresentationsDialogService,
    private readonly _router: Router
  ) {}

  preview() {
    const url = this._router.serializeUrl(
      this._router.createUrlTree([
        `projects/${this.presentation?.Project.Id}/presentations/${this.presentation?.Id}`,
      ])
    );
    window.open(url, '_blank');
  }

  async sharePresentation() {
    await firstValueFrom(this._dialogService.openSharePresentation());
  }
}

@NgModule({
  declarations: [PresentationCardMenuComponent],
  imports: [MatDialogModule, MatMenuModule],
  exports: [PresentationCardMenuComponent],
})
export class PresentationCardMenuModule {}
