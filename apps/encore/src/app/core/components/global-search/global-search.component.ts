/* eslint-disable @angular-eslint/use-component-view-encapsulation */
/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { SearchKey } from '@esp/products';
import { RouterFacade } from '@esp/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';
import { globalSearchConfig } from '../../configs';
import { GlobalSearchLocalState } from './global-search.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-global-search',
  },
  providers: [GlobalSearchLocalState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent implements OnChanges {
  @Input() size?: 'large' | null;
  @Input() keywords?: string;
  @Input() searchType?: string;
  @Output() keywordsChange: EventEmitter<string> = new EventEmitter<string>();
  searchForm = this.createForm();
  search: Subject<SearchKey> = new Subject<SearchKey>();
  searchConfig = globalSearchConfig;

  constructor(
    public readonly state: GlobalSearchLocalState,
    private _fb: FormBuilder,
    private _router: Router,
    private readonly _routerFacade: RouterFacade
  ) {
    state.connect(this);

    this.searchForm
      .get('keywords')
      .valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe(() => this.searchKeyChange(this.searchForm.value));

    this.search.pipe(untilDestroyed(this)).subscribe((data: SearchKey) => {
      this.state.searchType = data?.searchType;
      this.state.term = data?.keywords;

      switch (data.searchType) {
        case 'suppliers':
          this.getSuppliers(data);
          break;
        default:
          this.getProducts(data);
          break;
      }
    });

    this._routerFacade.url$
      .pipe(
        switchMap((url) =>
          this._routerFacade.queryParams$.pipe(
            tap((params) => {
              if (
                url?.startsWith('/suppliers') ||
                url?.startsWith('/products')
              ) {
                this.keywords = params.keywords || params.q;
                this.searchType = url?.startsWith('/suppliers')
                  ? 'suppliers'
                  : 'products';
                this.state.searchType = this.searchType;
                this.state.term = this.keywords;
              }
            })
          )
        ),
        untilDestroyed(this)
      )
      .subscribe();

    this._routerFacade.data$
      .pipe(
        filter((data) => !!data),
        debounceTime(100),
        untilDestroyed(this)
      )
      .subscribe((data) => {
        if (!data.hideGlobalSearch) {
          this.searchForm.controls.keywords.setValue(this.state.term);
          this.searchForm.controls.searchType.setValue(this.state.searchType);
        }
      });
  }

  ngOnChanges(changes): void {
    if (changes.keywords?.currentValue) {
      this.searchForm.controls.keywords.setValue(changes.keywords.currentValue);
    }

    if (changes.searchType?.currentValue) {
      this.searchForm.controls.searchType.setValue(
        changes.searchType.currentValue
      );
    }
  }

  private getProducts(data: SearchKey): void {
    this.goToResults(data, '/products');
  }

  private getSuppliers(data: SearchKey): void {
    this.goToResults(data, '/suppliers');
  }

  private goToResults(data: SearchKey, page: string) {
    if (data.keywords?.length > 1) {
      this._router.navigate([page], { queryParams: { q: data.keywords } });
    }
  }

  private createForm() {
    return this._fb.group({
      keywords: [''],
      searchType: [''],
    });
  }

  private searchKeyChange(data: SearchKey): void {
    if (data) {
      this.keywordsChange.emit(data.keywords);
      this.state.getKeywordSuggestions({
        prefix: data.keywords,
        limit: 5,
      });
    }
  }
}

@NgModule({
  declarations: [GlobalSearchComponent],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatMenuModule,
    CosButtonModule,
    CosInputModule,
    CosSlideToggleModule,
    RouterModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  exports: [GlobalSearchComponent],
})
export class GlobalSearchComponentModule {}
