import { Page } from '@cosmos/cypress';

const PAGE_OBJECTS = {
  productList: () => cy.get('cos-product-card'),
  showMore: () => cy.get('.show-more button.cos-button'),
  showLess: () => cy.get('.show-less button.cos-button'),
  searchText: () => cy.get('.search-keywords input'),
  productCpnSearch: () => cy.get('.cos-global-search input'),
  productCpnNum: () => cy.get('.product-cpn'),
  selectProduct: () =>
    cy.get('.cos-product-card-title > .cos-product-card-title-link'),
  excludeDropdown: () =>
    cy.get(
      '.cos-filter-exclude-menu > .cos-filter-menu-desktop > .mat-tooltip-trigger'
    ),
  filterMenuExclude: () => cy.get('.filter-menu-exclude-input'),
  cosFilterApplyButton: () => cy.get('.cos-filter-apply-button'),
  pills: () => cy.get('asi-filter-pills').find('.cos-pill'),
  clearPill: () => cy.get('asi-filter-pills').find('.cos-pill a'),
  goToHome: () => cy.get('#main .cos-global-header .logo'),
  cosFilterMenu: () => cy.get('.cos-filter-menu'),
  filterMenuSupplierSearchTerm: () =>
    cy.get('#filter-menu-supplier-search-term'),
  filterMenuColorSearchTerm: () => cy.get('#filter-menu-color-search-term'),
  filterMenuQuantity: () => cy.get('#filter-menu-quantity'),
  filterMenuRating: () => cy.get('#filter-menu-rating'),
  filterMenuCategory: () => cy.get('#filter-menu-category'),
  filterMenuCategorySearchTerm: () =>
    cy.get('#filter-menu-category-search-term'),
  matPseudoCheckbox: () => cy.get('.mat-pseudo-checkbox'),
  costFilterResetButton: () => cy.get('.cos-filter-reset-button'),
  filterMenuPriceFrom: () => cy.get('#filter-menu-price-from'),
  filterMenuPriceTo: () => cy.get('#filter-menu-price-to'),
  showMoreLessButton: () => cy.get('cos-filter-controls .cos-button'),
  cosFormFieldTypeCosInput: () =>
    cy.get('.cos-form-field-input-wrapper .mat-autocomplete-trigger'),
  cosMegaMenuApplyButton: () =>
    cy.get(
      '.cos-filters-mega-menu .cos-mega-menu-controls button.cos-flat-button'
    ),
  cosMegaMenuResetButton: () =>
    cy.get(
      '.cos-filters-mega-menu .cos-mega-menu-controls button.cos-stroked-button'
    ),
  Checkbox: () => cy.get('.cos-checkbox-background'),
} as const;
export class ProductSearchPage extends Page<typeof PAGE_OBJECTS> {
  uri = '/products';

  constructor() {
    super(PAGE_OBJECTS);
  }

  open(query: string) {
    return cy.navigateByUrl(`${this.uri}?q=${query}`).wait('@searchProducts');
  }
}
