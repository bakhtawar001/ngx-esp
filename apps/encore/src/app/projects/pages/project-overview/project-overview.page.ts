import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCardTreeModule } from '@cosmos/components/card-tree';
import { CosContextIconModule } from '@cosmos/components/context-icon';
import { CosPillModule } from '@cosmos/components/pill';
import { CosTrackerModule } from '@cosmos/components/tracker';
import { CosTrackerAccordionModule } from '@cosmos/components/tracker-accordion';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  CardMetadataListModule,
  NotificationCardModule,
  ProjectCardModule,
  SalesOrderCardModule,
} from '../../../core/components/cards';
import { ProjectDetailSidebarModule } from '../../components/project-detail-sidebar';
import { ProjectAddNoteDialog } from '../../dialogs/project-add-note/project-add-note.dialog';
import {
  ProjectContactInfoDialog,
  ProjectContactInfoDialogModule,
} from '../../dialogs/project-contact-info/project-contact-info.dialog';
import { ProjectOverviewLocalState } from './project-overview.local-state';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-project-overview',
  templateUrl: './project-overview.page.html',
  styleUrls: ['./project-overview.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ProjectOverviewLocalState],
})
export class ProjectOverviewPage implements OnInit {
  isDesktop = true;
  currentRoute = '';

  openItems = [
    {
      phases: [
        { complete: true, current: false },
        { complete: false, current: true },
        { complete: false, current: false },
        { complete: false, current: false },
        { complete: false, current: false },
      ],
      children: [{}, {}, {}],
      detailShown: true,
    },
  ];

  contacts = [
    {
      avatar: '',
      last_name: 'Park',
      first_name: 'Elizabeth',
      company: '',
      company_role: 'Events Coordinator',
      phone: '800-867-5309',
      email: 'jepark@greenstonefinancial.com',
      address: {
        Line1: '',
        Line2: '',
        CountryCode: '',
        State: '',
        PostalCode: '',
      },
    },
    {
      avatar: '',
      last_name: 'Bob',
      first_name: 'Greeway',
      company: '',
      company_role: 'That dude',
      phone: '800-867-5309',
      email: 'bigbob@greenstonefinancial.com',
      address: {
        Line1: '',
        Line2: '',
        CountryCode: '',
        State: '',
        PostalCode: '',
      },
    },

    {
      avatar: '',
      last_name: 'Bill',
      first_name: 'Smitch',
      company: '',
      company_role: 'THE dude',
      phone: '800-867-5309',
      email: 'bsmith@greenstonefinancial.com',
      address: {
        Line1: '',
        Line2: '',
        CountryCode: '',
        State: '',
        PostalCode: '',
      },
    },
  ];

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly changeDetectorRef: ChangeDetectorRef,
    public readonly dialog: MatDialog,
    private readonly router: Router,
    public readonly state: ProjectOverviewLocalState
  ) {
    this.currentRoute = router.url;
    this.state.connect(this);
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.isDesktop = result.matches;

        this.openItems.forEach((x) => {
          x.detailShown = result.matches;
        });

        this.changeDetectorRef.markForCheck();
      });
  }

  /** TODO: yup ... def refactor this */
  openDialog(dialogName) {
    let dialogModule;
    switch (dialogName) {
      case 'addnote':
        dialogModule = ProjectAddNoteDialog;
        break;
      case 'contact':
        dialogModule = ProjectContactInfoDialog;
    }

    const dialogRef = this.dialog.open(dialogModule, {
      width: '625px',
      height: '625px',
    });
  }
}

@NgModule({
  declarations: [ProjectOverviewPage],
  imports: [
    CommonModule,
    MatDialogModule,

    ProjectContactInfoDialogModule,
    ProjectDetailSidebarModule,
    ProjectCardModule,
    CardMetadataListModule,
    SalesOrderCardModule,

    NotificationCardModule,

    CosButtonModule,
    CosTrackerModule,
    CosCardTreeModule,
    CosCardModule,
    CosPillModule,
    CosAvatarModule,
    CosContextIconModule,
    CosTrackerAccordionModule,
  ],
})
export class ProjectOverviewPageModule {}
