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
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { InitialsPipeModule, ReactiveComponent } from '@cosmos/common';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosAvatarModule } from '@cosmos/components/avatar';
import {
  AutocompleteActions,
  AutocompleteParams,
  AutocompleteQueries,
  SimpleParty,
} from '@esp/autocomplete';
import { PartyBase } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'asi-party-autocomplete',
  templateUrl: './asi-party-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiPartyAutocompleteComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiPartyAutocompleteComponent
  extends ReactiveComponent<{
    parties: SimpleParty[];
  }>
  implements ControlValueAccessor
{
  @Input() label: string;
  @Input() placeholder: string;
  @Input() filters: AutocompleteParams['filters'];
  @Input() type = 'orderContact';
  @Input() excludeList: string[];

  searchTerm = new Subject<string>();

  constructor(private readonly store: Store) {
    super();

    this.searchTerm
      .pipe(debounceTime(200), untilDestroyed(this))
      .subscribe((val) => {
        const search: AutocompleteParams = {
          term: val,
          type: this.type,
          // from: 1,
          // size: 5,
          // sortBy: '',
          status: 'Active',
          filters: this.filters,
        };

        this.store.dispatch(new AutocompleteActions.SearchParties(search));
      });

    this.value.valueChanges.pipe(untilDestroyed(this)).subscribe((val) => {
      return this.onChange(val);
    });
  }

  public value = new FormControl();
  public searchForm: FormGroup;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onChange = (obj: PartyBase) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};

  get options() {
    return this.state.parties;
  }

  public asParty(val: any): SimpleParty {
    return val;
  }

  public search($event) {
    this.searchTerm.next($event);
  }

  public imgError(event) {
    event.target.style.display = 'none';
  }

  protected override setState() {
    this.state = this.connect({
      parties: this.store.select(AutocompleteQueries.getParties),
    });
  }

  public writeValue(obj: PartyBase): void {
    this.value.setValue(obj);
  }

  public registerOnChange(fn: (obj: PartyBase) => void): void {
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
  declarations: [AsiPartyAutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CosAutocompleteModule,
    CosAvatarModule,
    InitialsPipeModule,
  ],
  exports: [AsiPartyAutocompleteComponent],
})
export class AsiPartyAutocompleteComponentModule {}
