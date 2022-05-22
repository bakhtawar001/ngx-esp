import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { AsiEmptyStateInfoModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import { CosToastService } from '@cosmos/components/notification';
import { trackItem } from '@cosmos/core';
import { NavigationItem } from '@cosmos/layout';
import { CompaniesService } from '@esp/companies';
import { CompanySearch } from '@esp/models';
import {
  EspSearchPaginationModule,
  EspSearchTabsModule,
  SEARCH_LOCAL_STATE,
} from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { lastValueFrom } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { DIRECTORY_MENU } from '../../../directory/configs';
import { CompanyCardComponentModule } from '../../components/company-card';
import { CompanySearchFiltersModule } from '../../components/company-search-filters';
import { CompanySearchHeaderModule } from '../../components/company-search-header';
import { COMPANIES_TABS } from '../../configs';
import { CompanySearchLocalState } from '../../local-states';
import { CosPaginationModule } from '@cosmos/components/pagination';
import { CompaniesDialogService } from '../../services';

interface EmptyStateInfoOption {
  mainText: string;
  secondText: string;
  thirdText: string;
  ctaText: string;
}

interface EmptyStateInfoOptionSet {
  [key: string]: EmptyStateInfoOption;
}

const emptyStateInfoOptions: EmptyStateInfoOptionSet = {
  Company: {
    mainText: 'No Companies',
    secondText: 'There are no companies in your directory.',
    thirdText: 'Create a new company record to begin.',
    ctaText: 'Create New Company',
  },
  Customer: {
    mainText: 'No Customers',
    secondText: 'There are no customers in your directory.',
    thirdText: 'Create a new customer record to begin.',
    ctaText: 'Create New Customer',
  },
  Supplier: {
    mainText: 'No Suppliers',
    secondText: 'There are no suppliers in your directory.',
    thirdText: 'Create a new supplier record to begin.',
    ctaText: 'Create New Supplier',
  },
  Decorator: {
    mainText: 'No Decorators',
    secondText: 'There are no decorators in your directory.',
    thirdText: 'Create a new decorator record to begin.',
    ctaText: 'Create New Decorator',
  },
};

@UntilDestroy()
@Component({
  selector: 'esp-company-search-page',
  templateUrl: './company-search.page.html',
  styleUrls: ['./company-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CompanySearchLocalState,
    { provide: SEARCH_LOCAL_STATE, useExisting: CompanySearchLocalState },
  ],
})
export class CompanySearchPage {
  emptyStateInfoOption!: EmptyStateInfoOption;
  tabs = COMPANIES_TABS;
  trackCompany = trackItem<CompanySearch>(['Id']);

  constructor(
    public readonly state: CompanySearchLocalState,
    @Inject(DIRECTORY_MENU) readonly menu: NavigationItem[],
    private readonly _router: Router,
    private readonly _companiesService: CompaniesService,
    private readonly _toastService: CosToastService,
    private readonly _collaboratorsDialogService: CollaboratorsDialogService,
    private readonly _dialog: MatDialog,
    private readonly _companiesDialogService: CompaniesDialogService
  ) {
    this.state.connect(this);

    this.emptyStateInfoOption =
      emptyStateInfoOptions[this.state.searchType.type];
  }

  createNewParty(): void {
    // @TODO create company-crud.service.ts and handle create/delete/transferOwnership with it here and in company-actions-bar
    this._companiesDialogService
      .createCompany({
        companyId: 0,
        type: this.state.searchType?.type,
      })
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe(() => {
        this.state.search(this.state.criteria);
      });
  }

  navigateToCompany(company: CompanySearch): void {
    this._router.navigate([`companies`, company.Id], {
      queryParams: { type: this.state.searchType.value },
      state: {
        backToDirectoryUrl: this._router.url,
      },
    });
  }

  delete(party: CompanySearch) {
    const confirmDialog = this._dialog.open(CosConfirmDialog, {
      minWidth: '400px',
      width: '400px',
      data: {
        message: `Are you sure you want to delete this ${this.state.searchType?.type}?`,
        confirm: `Yes, remove this ${this.state.searchType?.type}`,
        cancel: 'No, do not delete',
      },
    });

    confirmDialog
      .afterClosed()
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe({
        next: () => {
          this.state.deleteCompany(party);
        },
      });
  }

  search() {
    this.state.search(this.state.criteria);
  }

  toggleStatus(party: CompanySearch) {
    this.state.toggleStatus(party.Id, !party.IsActive);
  }

  async transferOwnership(party: CompanySearch) {
    if (party) {
      await lastValueFrom(
        this._collaboratorsDialogService
          .openTransferOwnershipDialog({
            entity: party,
          })
          .pipe(
            tap((result) => {
              if (result && result.Id) {
                this._companiesService
                  .transferOwner(party.Id, result.Id)
                  .pipe(take(1), untilDestroyed(this))
                  .subscribe({
                    complete: () => {
                      this.search();

                      this._toastService.success(
                        'Ownership Transferred!',
                        `Ownership has been transferred to ${result.Name}`
                      );
                    },
                    error: () => {
                      this._toastService.error(
                        'Error: Ownership Not Transferred!',
                        `Ownership of ${party.Name} was unable to be transferred!`
                      );
                    },
                  });
              }
            })
          )
      );
    }
  }
}

@NgModule({
  declarations: [CompanySearchPage],
  imports: [
    CommonModule,
    RouterModule,

    CosButtonModule,

    CompanyCardComponentModule,
    CompanySearchHeaderModule,

    EspSearchPaginationModule,
    EspSearchTabsModule,
    CosPaginationModule,
    AsiEmptyStateInfoModule,
  ],
})
export class CompanySearchPageModule {}
