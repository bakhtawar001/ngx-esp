export class MatAutocomplete {
  static options() {
    return cy
      .get('.mat-autocomplete-panel.mat-autocomplete-visible')
      .find('mat-option');
  }
}
