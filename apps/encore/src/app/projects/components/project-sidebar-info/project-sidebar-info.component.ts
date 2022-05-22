import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CosButtonModule } from '@cosmos/components/button';
import { Project } from '@esp/models';
import { firstValueFrom } from 'rxjs';
import { ProjectsDialogService } from '../../services';
import { DisplayCurrencyValuePipe } from './display-currency-value.pipe';
import { DisplayDateValuePipe } from './display-date-value.pipe';
import { DisplayNumberValuePipe } from './display-number-value.pipe';

@Component({
  selector: 'esp-project-sidebar-info',
  templateUrl: './project-sidebar-info.component.html',
  styleUrls: ['./project-sidebar-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSidebarInfoComponent {
  @Input()
  project!: Project;

  constructor(private readonly dialogService: ProjectsDialogService) {}

  async openEditDialog(): Promise<void> {
    if (!this.project) {
      return;
    }

    await firstValueFrom(
      this.dialogService.openProjectEditInfoDialog(this.project)
    );
  }
}

@NgModule({
  imports: [CommonModule, CosButtonModule, MatTooltipModule],
  declarations: [
    ProjectSidebarInfoComponent,
    DisplayCurrencyValuePipe,
    DisplayDateValuePipe,
    DisplayNumberValuePipe,
  ],
  exports: [ProjectSidebarInfoComponent],
  providers: [CurrencyPipe, DatePipe, DecimalPipe],
})
export class ProjectSidebarInfoModule {}
