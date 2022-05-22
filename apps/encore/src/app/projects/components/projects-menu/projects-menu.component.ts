import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { trackItem } from '@cosmos/core';
import { FormControl } from '@cosmos/forms';
import { ProjectSearch } from '@esp/projects';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AsiCompanyAvatarModule } from '@asi/company/ui/feature-components';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MenuLink } from './models';
import { ProjectsMenuLinks } from './projects-menu.links';
import { ProjectsMenuLocalState } from './projects-menu.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-projects-menu',
  templateUrl: './projects-menu.component.html',
  styleUrls: ['./projects-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsMenuLocalState],
})
export class ProjectsMenuComponent implements OnInit {
  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  searchControl = new FormControl('');

  readonly links = ProjectsMenuLinks;
  readonly trackByProjectFn = trackItem<ProjectSearch>(['Id']);
  readonly trackByLinkFn = trackItem<MenuLink>(['id']);

  constructor(public readonly state: ProjectsMenuLocalState) {
    this.state.connect(this);
  }

  ngOnInit(): void {
    this.listenToSearchControlChange();
  }

  onClearSearch(): void {
    this.searchControl.reset('');
  }

  onClickStopPropagation(): void {
    // do nothing
  }

  private listenToSearchControlChange(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((term: string) => {
        this.state.search({
          term,
          size: ProjectsMenuLocalState.maxProjectsCount,
          status: ProjectsMenuLocalState.projectsStatus,
        });
      });
  }
}

@NgModule({
  imports: [
    CommonModule,

    RouterModule,

    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule,

    CosAvatarModule,
    CosButtonModule,
    CosInputModule,
    AsiCompanyAvatarModule,
  ],
  declarations: [ProjectsMenuComponent],
  exports: [ProjectsMenuComponent],
})
export class ProjectsMenuComponentModule {}
