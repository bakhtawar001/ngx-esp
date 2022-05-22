export enum LeftNavOption {
  customers = '.nav-link-icon.fa.fa-users',
  suppliers = '.nav-link-icon.fa.fa-industry',
  decorators = '.nav-link-icon.fa.fa-palette',
  contacts = '.nav-link-icon.fa.fa-address-card',
}

export enum TabOption {
  active = '.active-entities',
  ownedByMe = '.owned-by-me-entities',
  sharedEntities = '.shared-entities',
  inactiveEntities = '.inactive-entities',
}

export enum SortOption {
  name = '.name',
  dateAdded = '.date-added',
  lastActivityDate = '.last-activity-date',
}

export enum CardMenuOptions {
  transferOwnership = '.transfer-ownership',
  makeActive = '.make-active',
  makeInactive = '.make-inactive',
  delete = '.delete',
}

export class DirectorySearch {
  uri = '/directory';
  eleSortMenuTrigger = '.sort-by-trigger';
  eleSearchBar = '.parties-search';
  eleNotFoundText = '.empty-results-msg';
  eleCosCardMenu = 'cos-card-menu .button';

  clickNavMenuOption(option: LeftNavOption) {
    return cy.get(option).invoke('click');
  }

  clickTab(option: TabOption) {
    return cy.get(option).invoke('click');
  }

  clickCardMenu(index = 0) {
    return cy
      .get(this.eleCosCardMenu)
      .then((elements) => elements[index].click());
  }

  clickCardMenuOption(option: CardMenuOptions) {
    return cy.get(option).invoke('click');
  }

  changeSort(option: SortOption) {
    return cy
      .get(this.eleSortMenuTrigger)
      .trigger('click')
      .then(() => cy.get(option).invoke('click'));
  }

  setSearchText(text: string = 'Testy Test tester test man!') {
    return cy.get(this.eleSearchBar).type(text);
  }

  getSearchText() {
    return cy.get(this.eleSearchBar).invoke('val');
  }

  getSearchPlaceholder() {
    return cy.get(this.eleSearchBar).invoke('attr', 'placeholder');
  }

  getNotFoundText() {
    return cy.get(this.eleNotFoundText).invoke('text');
  }
}
