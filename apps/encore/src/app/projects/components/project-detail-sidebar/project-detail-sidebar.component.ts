import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Project } from '@esp/models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosContextIconModule } from '@cosmos/components/context-icon';
import { CosTrackerAccordionModule } from '@cosmos/components/tracker-accordion';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem } from '@cosmos/layout/navigation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProjectsMenu } from '../../configs';
import {
  ProjectContactInfoDialog,
  ProjectContactInfoDialogModule,
} from '../../dialogs/project-contact-info/project-contact-info.dialog';
import { ProjectSidebarInfoModule } from '../project-sidebar-info';

@UntilDestroy()
@Component({
  selector: 'esp-project-detail-sidebar',
  templateUrl: './project-detail-sidebar.component.html',
  styleUrls: ['./project-detail-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDetailSidebarComponent implements OnInit {
  @Input() project!: Project;

  isDesktop = true;
  activePage: NavigationItem;

  readonly menu = ProjectsMenu;

  constructor(
    public readonly dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly cd: ChangeDetectorRef
  ) {}

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.isDesktop = result.matches;
        this.cd.markForCheck();
      });
  }

  /** TODO: yup ... def refactor this */
  openDialog(dialogName) {
    let dialogModule;
    switch (dialogName) {
      case 'contact':
        dialogModule = ProjectContactInfoDialog;
    }

    this.dialog.open(dialogModule, {
      width: '625px',
      height: '625px',
    });
  }
}

@NgModule({
  declarations: [ProjectDetailSidebarComponent],
  imports: [
    CommonModule,
    LayoutModule,
    CosButtonModule,
    CosCardModule,
    CosAvatarModule,
    CosContextIconModule,
    CosAccordionModule,
    CosTrackerAccordionModule,
    ProjectContactInfoDialogModule,
    ProjectSidebarInfoModule,
    MatDialogModule,
    CosVerticalMenuModule,
  ],
  exports: [ProjectDetailSidebarComponent],
})
export class ProjectDetailSidebarModule {}
