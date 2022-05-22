/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { FormControl } from '@cosmos/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchLocalState, SEARCH_LOCAL_STATE } from '../../local-states';

@UntilDestroy()
@Component({
  selector: 'esp-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SearchBoxComponent implements AfterViewInit {
  private state$ = this.state.connect(this);

  @ViewChild('searchBox', { static: true }) searchBox: ElementRef;

  searchTerm = new FormControl<string>(this.state.term ?? '');

  @Input() placeholder = 'Search';
  @Input() submitTitle = 'Submit';
  // @Input() resetTitle: string = 'Reset';
  @Input() searchAsYouType = true;
  @Input() debounceTime = 300;
  @Input() autofocus = false;

  @Output() change = new EventEmitter();
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() submit = new EventEmitter();

  /**
   * Constructor
   *
   */
  constructor(
    @Inject(SEARCH_LOCAL_STATE) public readonly state: SearchLocalState
  ) {
    this._init();
  }

  ngAfterViewInit(): void {
    if (this.autofocus) {
      this.searchBox.nativeElement.focus();
    }
  }

  search(event: Event): void {
    this.submit.emit(event);
    this._setQuery(this.searchTerm.value);
  }

  clickFocus(): void {
    this.searchBox.nativeElement.focus();
  }

  private _init(): void {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe({
        next: (term) => {
          this.change.emit(term);

          if (this.searchAsYouType) {
            this._setQuery(term);
          }
        },
      });
  }

  private _setQuery(term: string): void {
    this.state.from = 1;
    this.state.term = term;
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CosButtonModule, CosInputModule],
  declarations: [SearchBoxComponent],
  exports: [SearchBoxComponent],
})
export class EspSearchBoxModule {}
