import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import data from './filters.data.json';

@Component({
  selector: 'cos-filters-demo-component',
  styleUrls: ['./filters-demo.scss'],
  template: `
    <cos-filters
      [appliedFilters]="appliedFilters"
      (resetFiltersEvent)="clearFilters()"
      (applyFiltersEvent)="applyFilters()"
    >
      <cos-filter-controls (clickOutside)="onClickedOutside($event)">
        <button
          cos-button
          (click)="toggleShowAllFilters($event)"
          (keydown)="checkShiftTabOff($event)"
        >
          {{ showAllFilters ? 'Show Less' : 'Show More' }}
        </button>

        <span
          (click)="$event.stopPropagation()"
          *ngIf="showAllFilters && isDesktop"
        >
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </span>

        <button cos-button (click)="clearFilters()">Clear all filters</button>
      </cos-filter-controls>
      <cos-filter-menu
        label="Disabled"
        disabled="true"
        *ngIf="isDesktop"
      ></cos-filter-menu>
      <cos-filter-menu
        label="Categories"
        [applied]="hasAppliedFilters('Categories')"
      >
        <cos-form-field>
          <cos-label>Category</cos-label>
          <select
            matNativeControl
            id="filter-menu-category"
            [(ngModel)]="selectedCategoryId"
            (click)="$event.stopPropagation()"
          >
            <option
              *ngFor="let category of data.Dimensions.Categories"
              [value]="category.Id"
            >
              {{ category.Name }}
            </option>
          </select>
        </cos-form-field>
        <fieldset
          *ngIf="selectedSubcategories.length > 0"
          class="cos-form-field"
        >
          <legend class="cos-form-label">Sub-Category</legend>
          <input
            cos-input
            type="search"
            [(ngModel)]="subcategorySearchString"
            id="subcategory-search"
            placeholder="Sub-category"
            aria-label="Sub-Category search"
            (click)="$event.stopPropagation()"
          />
          <cos-checkbox
            *ngFor="let subcategory of filteredSubcategories"
            [id]="'subcategory-' + subcategory.Id"
            [name]="subcategory.Id"
            [value]="subcategory.Id"
            [checked]="isFilterApplied('Categories', subcategory.Id)"
          >
            <span>{{ subcategory.Name }}</span
            ><span class="cos-filter-menu-count">
              ({{ subcategory.Products }})</span
            >
          </cos-checkbox>
        </fieldset>
      </cos-filter-menu>
      <cos-filter-menu
        label="Suppliers"
        [applied]="hasAppliedFilters('Suppliers')"
      >
        <cos-button-group
          [toggleOptions]="[
            { name: 'Suppliers', value: 'suppliers', disabled: false },
            { name: 'Pref group', value: 'prefGroup', disabled: false }
          ]"
          defaultSelection="suppliers"
          toggleAriaLabel="Supplier Options"
          groupName="segmentOptions"
          (click)="$event.stopPropagation()"
        ></cos-button-group>
        <fieldset class="cos-form-field">
          <legend class="cos-form-label cos-accessibly-hidden">
            Suppliers
          </legend>
          <input
            cos-input
            type="search"
            [(ngModel)]="supplierSearchString"
            id="supplier-search"
            placeholder="Supplier name"
            aria-label="Supplier search"
            (click)="$event.stopPropagation()"
          />
          <cos-checkbox
            *ngFor="let supplier of filteredSuppliers; index as i"
            [ngStyle]="{
              display: showAllSuppliers || i < supplierLimit ? 'block' : 'none'
            }"
            [id]="'supplier-' + supplier.Id"
            [name]="supplier.Id"
            [value]="supplier.Id"
            [checked]="isFilterApplied('Suppliers', supplier.Id)"
          >
            <span>{{ supplier.Name }}</span
            ><span class="cos-filter-menu-count">
              ({{ supplier.Products }})</span
            >
          </cos-checkbox>
          <button
            *ngIf="!isDesktop"
            [ngClass]="'cos-filter-show-more'"
            cos-button
            (click.stop)="toggleShowAllSuppliers()"
          >
            {{ showAllSuppliersButtonText }}
          </button>
        </fieldset>
      </cos-filter-menu>
      <cos-filter-menu label="Quantity" [applied]="false">
        <cos-form-field>
          <cos-label>Quantity</cos-label>
          <input cos-input type="number" placeholder="Quantity" />
        </cos-form-field>
      </cos-filter-menu>
      <cos-filter-menu label="Price" [applied]="false">
        <cos-form-field>
          <cos-label>Price per unit range</cos-label>
          <div class="cos-inline">
            <input cos-input placeholder="Min price" />
            <span>-</span>
            <input cos-input placeholder="Max price" />
          </div>
        </cos-form-field>
      </cos-filter-menu>

      <div *ngIf="!isDesktop">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </div>
    </cos-filters>

    <ng-template #content>
      <div class="cos-filters-mega-menu" (click)="$event.stopPropagation()">
        <div class="cos-filter-menu cos-form-row">
          <label class="cos-form-label" for="sizeInput"> Size </label>
          <input
            cos-input
            [attr.id]="id"
            id="sizeInput"
            placeholder="Enter a value"
          />
        </div>
        <div class="cos-filter-menu cos-form-row">
          <label class="cos-form-label" for="materialInput"> Material </label>
          <input
            cos-input
            [attr.id]="id"
            id="materialInput"
            placeholder="Enter a value"
          />
        </div>
        <div class="cos-filter-menu cos-form-row">
          <label class="cos-form-label" for="imprintSelect"> Imprint </label>
          <select matNativeControl attr.id="imprintSelect">
            <option value="">Imprint Method</option>
            <option value="1">Apples</option>
            <option value="2">Bananas</option>
            <option value="3">Grapes</option>
            <option value="4">Oranges</option>
          </select>
        </div>
        <div class="cos-filter-menu cos-form-row">
          <span class="cos-form-label"> Other Stuff </span>
          <div class="cos-mega-menu-demo-radios">
            <ng-template ngFor let-item [ngForOf]="checkboxes" let-i="index">
              <cos-checkbox id="checkbox-{{ i }}" name="checkbox-{{ i }}">
                {{ checkboxes[i] }}
              </cos-checkbox>
            </ng-template>
          </div>
        </div>
        <div class="cos-filter-menu cos-form-row">
          <span class="cos-form-label">Market</span>
          <div
            class="cos-mega-menu-demo-radios cos-mega-menu-demo-radios--market"
          >
            <cos-checkbox id="checkbox-us" name="checkbox-us">
              US Market
            </cos-checkbox>
            <cos-checkbox id="checkbox-ca" name="checkbox-ca">
              Canadian Market
            </cos-checkbox>
          </div>
        </div>
        <div class="cos-mega-menu-demo-controls" *ngIf="isDesktop">
          <button cos-stroked-button color="primary" (click)="clearFilters()">
            Reset
          </button>
          <button
            cos-flat-button
            color="primary"
            (click)="applyFilters()"
            (keydown)="checkTabOff($event)"
          >
            Apply
          </button>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosFiltersDemoComponent implements OnDestroy {
  isDesktop = false;
  data = data;
  supplierSearchString = '';
  subcategorySearchString = '';
  supplierLimit = 5;
  intialFiltersToShow = 4;
  showAllSuppliers = true;
  showAllFilters = false;

  checkboxes = [
    'Live Product Feed',
    'Specials',
    'With Virutal Samples',
    'With Rush Service',
    'Use Pricing',
    'Live Inventory',
    'With Prices',
    'Made in the USA',
    'Full-Color Process',
    'Canadian Pricing (CAD)',
    'E-commm Connected',
    'With Images',
    'Union Affiliated',
    'Personalized',
    'Prop 65 Warnings',
    'New Products',
    'With Videos',
    'Minority Owned',
    'Sold Unimprinted',
    'No Hazardous Materials',
    'No Choking Hazard',
  ];

  menuYPosition = 'below';

  // Randomly determining some filters to show as applied
  appliedFilters = {
    Categories: [
      this.data.Dimensions.Categories[2],
      this.data.Dimensions.Categories[2].Subcategories[1],
      this.data.Dimensions.Categories[2].Subcategories[5],
    ],
    Suppliers: [this.data.Dimensions.Suppliers[3]],
  };
  selectedCategoryId = this.appliedFilters.Categories[0].Id;

  private destroy$ = new Subject<void>();

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isDesktop = result.matches;
        this.showAllSuppliers = this.isDesktop;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  get selectedSubcategories() {
    let subcategories = [];
    if (this.selectedCategoryId.length > 0)
      subcategories = this.data.Dimensions.Categories.find(
        (x: any) => x.Id === this.selectedCategoryId
      ).Subcategories;
    return subcategories || [];
  }

  get filteredSubcategories() {
    return this.subcategorySearchString.length > 0
      ? this.selectedSubcategories.filter((x: any) =>
          x.Name.toLowerCase().includes(
            this.subcategorySearchString.toLowerCase()
          )
        )
      : this.selectedSubcategories;
  }

  get filteredSuppliers() {
    return this.supplierSearchString.length > 0
      ? this.data.Dimensions.Suppliers.filter((x: any) =>
          x.Name.toLowerCase().includes(this.supplierSearchString.toLowerCase())
        )
      : this.data.Dimensions.Suppliers;
  }

  get showAllSuppliersButtonText() {
    return this.showAllSuppliers ? 'Show less' : 'Show more';
  }

  toggleShowAllSuppliers(): void {
    this.showAllSuppliers = !this.showAllSuppliers;
  }

  onClickedOutside() {
    this.showAllFilters = false;
  }

  toggleShowAllFilters() {
    this.showAllFilters = !this.showAllFilters;
  }

  isFilterApplied(dimension: 'Categories' | 'Suppliers', id: any) {
    return (
      this.appliedFilters[dimension] &&
      this.appliedFilters[dimension].findIndex((x) => x.Id === id) > -1
    );
  }

  hasAppliedFilters(dimension: 'Categories' | 'Suppliers') {
    return this.appliedFilters[dimension];
  }

  checkShiftTabOff(event: KeyboardEvent) {
    if (event.shiftKey && event.which === 9) this.showAllFilters = false;
  }

  checkTabOff(event: KeyboardEvent) {
    if (event.which === 9) this.showAllFilters = false;
  }

  applyFilters() {
    this.showAllFilters = false;
  }

  clearFilters() {
    console.log('clearFilters');
  }
}
