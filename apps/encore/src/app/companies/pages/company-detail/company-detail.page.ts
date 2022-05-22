import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { Navigation, Params, Router, RouterModule } from '@angular/router';
import {
  AsiManageCollaboratorsModule,
  CollaboratorsDialogService,
} from '@asi/collaborators/ui/feature-core';
import { DateAgoPipe, InitialsPipe } from '@cosmos/common';
import { Avatar, CosAvatarListModule } from '@cosmos/components/avatar-list';
import { CosButtonModule } from '@cosmos/components/button';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem } from '@cosmos/layout';
import {
  HasRolePipe,
  HasRolePipeModule,
  IsCollaboratorPipe,
  IsCollaboratorPipeModule,
  IsOwnerPipe,
  IsOwnerPipeModule,
} from '@esp/auth';
import { Company, Contact } from '@esp/models';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';
import { COMPANY_MENU, CompanyMenu } from '../../configs';
import { CompanyDetailLocalState } from '../../local-states';
import { AsiCompanyActionsItemsModule } from '@asi/company/ui/feature-components';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'esp-company-detail-page',
  templateUrl: './company-detail.page.html',
  styleUrls: ['./company-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    CompanyDetailLocalState,
    {
      provide: PARTY_LOCAL_STATE,
      useExisting: CompanyDetailLocalState,
    },
    {
      provide: COMPANY_MENU,
      useValue: CompanyMenu,
    },
  ],
})
export class CompanyDetailPage implements OnInit {
  canManageCollaborators = false;

  companyId: number;
  previousUrl: { url: string; params: Params };
  avatarList: Avatar[];
  initials = new InitialsPipe();
  dateAgoPipe = new DateAgoPipe();

  /** TODO: refactor this, the scheme here is just a guess */
  get activity() {
    return [
      {
        imgUrl: '',
        date: this.state.party?.LastActivityDate,
        action: 'Recent lorem ipsum doler sit amet',
        type: 'images',
      },
      {
        imgUrl: '',
        date: new Date('2020-01-10').toISOString(),
        action: 'Lorem ipsum doler sit amet',
        type: 'images',
      },
      {
        imgUrl: '',
        date: new Date('2019-06-22').toISOString(),
        action: 'Lorem ipsum doler sit amet',
        type: 'images',
      },
    ];
  }

  private readonly currentNavigation: Navigation | null =
    this._router.getCurrentNavigation();

  constructor(
    private readonly _collaboratorsDialogService: CollaboratorsDialogService,
    private readonly _hasRolePipe: HasRolePipe,
    private readonly _isCollaboratorPipe: IsCollaboratorPipe,
    private readonly _isOwnerPipe: IsOwnerPipe,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    public readonly state: CompanyDetailLocalState,
    @Inject(COMPANY_MENU) public menu: NavigationItem[]
  ) {
    this.state
      .connect(this)
      .pipe(
        filter((_) => !!_.party),
        untilDestroyed(this)
      )
      .subscribe((state) => {
        this.initCompany(state.party);
        this.initCanManageCollaborators();
      });
  }

  ngOnInit(): void {
    this.avatarList = this.state.party?.Collaborators?.map((c) => ({
      imgUrl: c.ImageUrl,
      toolTipText: c.Name,
      displayText: this.initials.transform(c.Name),
      icon: c.IsTeam ? 'fa-users' : '',
    }));
  }

  goBack(): void {
    // Caretaker note: the user may access the company detail page in 2 ways:
    // 1) click the company card on the `/directory/companies` page
    // 2) paste the link directly into a browser
    // As discussed with Leigh, we can redirect the user directly to `/directory/companies` if he/she pasted the link into the browser.
    // But we can save the `/directory/companies` URL with query parameters when the user comes to the company detail page by clicking
    // the company detail card.

    // See `company-search.page.ts -> CompanySearchPage#navigateToCompany`.
    if (this.currentNavigation?.extras.state?.backToDirectoryUrl) {
      this._router.navigateByUrl(
        this.currentNavigation.extras.state.backToDirectoryUrl
      );
    } else {
      this._router.navigateByUrl('/directory/companies');
    }
  }

  async onManageCollaborators(): Promise<void> {
    await firstValueFrom(
      this._collaboratorsDialogService.openManageCollaboratorsDialog({
        entity: this.state.company,
        isOnlyReadWrite: true,
      })
    ).then((result) => {
      if (result) {
        this.state.save({
          ...this.state.company,
          AccessLevel: result.AccessLevel,
          Access: result.Access,
          Collaborators: result.Collaborators,
        });
      }
    });
  }

  onToggleStatus(): void {
    this.state.toggleStatus(this.state.party.Id, !this.state.party.IsActive);
  }

  onDelete(): void {
    // TODO: use a crud service
    this._dialog
      .open(CosConfirmDialog, {
        minWidth: '400px',
        width: '400px',
        data: {
          message: 'Are you sure you want to delete this company?',
          confirm: 'Yes, remove this company',
          cancel: 'No, do not delete',
        },
      })
      .afterClosed()
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe({
        next: () => {
          this.state.deleteCompany(this.state.company);
        },
      });
  }

  onTransferOwner(): void {
    this._collaboratorsDialogService
      .openTransferOwnershipDialog({
        entity: this.state.party,
      })
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe({
        next: (newOwner) => {
          this.state.transferOwnership(this.state.company, newOwner);
        },
      });
  }

  private initCompany(party: Contact | Company) {
    const moreThanOneType =
      Object.keys(party).filter(
        (key) =>
          (key === 'IsSupplier' ||
            key === 'IsDecorator' ||
            key === 'IsCustomer') &&
          party[key] === true
      ).length > 1;
    if (moreThanOneType || (party['IsCustomer'] && party.IsActive)) {
      this.menu = this.menu.map((_) => ({ ..._, hidden: false }));
      return;
    }
    if (party['IsSupplier']) {
      this.menu = this.menu.map((_) =>
        _.id === 'artwork' || _.id === 'decorations'
          ? { ..._, hidden: true }
          : _
      );
    }
    if (party['IsDecorator'] || !party.IsActive) {
      this.menu = this.menu.map((_) =>
        _.id === 'projects' ||
        _.id === 'product-history' ||
        _.id === 'artwork' ||
        _.id === 'decorations'
          ? { ..._, hidden: true }
          : _
      );
    }
  }

  private initCanManageCollaborators(): void {
    this.canManageCollaborators =
      this._hasRolePipe.transform('Administrator') ||
      this._isCollaboratorPipe.transform(
        this.state.party?.Collaborators,
        'ReadWrite'
      ) ||
      this._isOwnerPipe.transform(this.state.party?.OwnerId) ||
      this.state.party?.AccessLevel === 'Everyone';
  }
}

@NgModule({
  declarations: [CompanyDetailPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HasRolePipeModule.withProvide(),
    IsCollaboratorPipeModule.withProvide(),
    IsOwnerPipeModule.withProvide(),

    RouterModule,

    MatMenuModule,
    MatTabsModule,

    CosAvatarListModule,
    CosButtonModule,
    CosVerticalMenuModule,

    DetailHeaderComponentModule,

    AsiManageCollaboratorsModule,
    AsiCompanyActionsItemsModule,
  ],
})
export class CompanyDetailPageModule {}
