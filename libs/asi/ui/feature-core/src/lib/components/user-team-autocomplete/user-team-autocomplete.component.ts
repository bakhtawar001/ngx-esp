import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  NgModule,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { InitialsPipeModule, ReactiveComponent } from '@cosmos/common';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { AutocompleteActions, AutocompleteQueries } from '@esp/autocomplete';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { debounceTime } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'asi-user-team-autocomplete',
  templateUrl: './user-team-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiUserTeamAutocompleteComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiUserTeamAutocompleteComponent
  extends ReactiveComponent
  implements ControlValueAccessor
{
  @Input()
  set excludeList(list: string) {
    this.searchForm.get('excludeList').setValue(list);
  }

  get options() {
    if (this.excludeTeams) {
      return this.state.users;
    } else {
      return this.state.usersAndTeams;
    }
  }

  constructor(private _formBuilder: FormBuilder, private store: Store) {
    super();

    this.searchForm = this.getSearchForm();
    this.searchForm.valueChanges
      .pipe(debounceTime(200), untilDestroyed(this))
      .subscribe((val) => {
        if (this.excludeTeams) {
          this.store.dispatch(new AutocompleteActions.SearchUsers(val));
        } else {
          this.store.dispatch(new AutocompleteActions.SearchUsersAndTeams(val));
        }
      });

    this.value.valueChanges.pipe(untilDestroyed(this)).subscribe((val) => {
      return this.onChange(val);
    });
  }
  @Input() label: string;
  @Input() placeholder: string;
  @Input() excludeTeams: boolean;

  public value = new FormControl();
  public searchForm: FormGroup;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onChange = (obj: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};

  public search($event) {
    this.searchForm.get('term').setValue($event);
  }

  public imgError(event) {
    event.target.style.display = 'none';
  }

  private getSearchForm() {
    return this._formBuilder.group({
      term: [''],
      from: 1,
      //size: 5,
      sortBy: '',
      status: ['Active'],
      filters: [''],
      excludeList: [''],
    });
  }

  protected override setState() {
    this.state = this.connect({
      usersAndTeams: this.store.select(AutocompleteQueries.getUsersAndTeams),
      users: this.store.select(AutocompleteQueries.getUsers),
    });
  }

  public writeValue(obj: any): void {
    this.value.setValue(obj);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.value.disable() : this.value.enable();
  }
}

@NgModule({
  declarations: [AsiUserTeamAutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CosAutocompleteModule,
    CosAvatarModule,
    InitialsPipeModule,
  ],
  exports: [AsiUserTeamAutocompleteComponent],
})
export class AsiUserTeamAutocompleteComponentModule {}
