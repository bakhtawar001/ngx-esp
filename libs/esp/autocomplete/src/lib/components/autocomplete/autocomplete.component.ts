import { Directive, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AutocompleteActions } from '../../actions';
import { AutocompleteType, AutocompleteValue } from '../../models';
import { AutocompleteQueries } from '../../queries';

@Directive()
export abstract class EspAutocompleteComponent
  implements OnInit, ControlValueAccessor {
  get value() {
    return this.autocompleteValue.value;
  }

  @Input()
  set value(val) {
    this.autocompleteValue.setValue(val);

    this.onChange(val);
    this.onTouched();
  }

  @Input() type!: string; // AutocompleteType

  autocompleteValue = new FormControl();
  values$!: Observable<AutocompleteValue[]>;

  autocompleteDisplay!: (val: AutocompleteValue) => string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.setValues('');
  }

  assignToChanged($event: any) {
    this.setValues($event.target.value);
  }

  writeValue(val: any): void {
    if (val) {
      this.value = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.autocompleteValue.disable();
    } else {
      this.autocompleteValue.enable();
    }
  }

  setValues(term: any) {
    const params = { term };

    if (this.type === AutocompleteType.Parties) {
      this.store.dispatch(new AutocompleteActions.SearchParties(params));
      this.values$ = this.store.select(AutocompleteQueries.getParties);
    } else if (this.type === AutocompleteType.Users) {
      this.store.dispatch(new AutocompleteActions.SearchUsers(params));
      this.values$ = this.store.select(AutocompleteQueries.getUsers);
    } else if (this.type === AutocompleteType.UsersAndTeams) {
      this.store.dispatch(new AutocompleteActions.SearchUsersAndTeams(params));
      this.values$ = this.store.select(AutocompleteQueries.getUsersAndTeams);
    }
  }
}
