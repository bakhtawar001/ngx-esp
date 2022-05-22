import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  map,
  catchError,
} from 'rxjs/operators';
import { ContentfulComponent } from '../contentful-component';
import { ContentfulTypeaheadEvent } from '@contentful/sponsored-content/models/contentful-typeahead-event.model';
import type { Entry, EntryCollection } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { RootContentfulService } from '@contentful/common/services/root-contentful.service';

declare type MappedContentfulEntity = {
  id: string;
  title: string;
  entity: Entry<unknown>;
};

@Component({
  selector: 'sponsored-content-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent
  extends ContentfulComponent
  implements OnInit, OnChanges
{
  @Input() debounce = 300;
  @Input()
  set isDisabled(disabled: boolean) {
    this._disabled = disabled;
  }
  get isDisabled() {
    return this._disabled;
  }
  @Input() loadingText = 'Loading';
  @Input() notFoundText = 'No results';
  @Input() numberOfResults = 5;
  @Input() placeholder = 'Select an article';
  @Input() value: string;
  @Input() sponsoredByAsiNumber: number;
  @Input() contentType: string;
  @Input() sponsoredById = 'sponsor';
  @Input() sponsoredByIdQueryPath = 'fields.sponsoredBy.sys.contentType.sys.id';
  @Input() asiNumberQueryPath = 'fields.sponsoredBy.fields.asiNumber';

  @Output() blur: EventEmitter<null> = new EventEmitter();
  @Output() clear: EventEmitter<null> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();
  @Output() focus: EventEmitter<null> = new EventEmitter();
  @Output() open: EventEmitter<null> = new EventEmitter();
  @Output() selected: EventEmitter<ContentfulTypeaheadEvent> =
    new EventEmitter();
  @Output() load: EventEmitter<ContentfulTypeaheadEvent> = new EventEmitter();

  _disabled = false;
  results$: Observable<MappedContentfulEntity[]>;
  searching = false;
  searchValue = new Subject<string>();
  typeaheadValue: MappedContentfulEntity;

  private loadingValue: string;
  private params = {
    skip: 0,
    query: {},
    limit: this.numberOfResults,
  };

  constructor(contentful: RootContentfulService) {
    super(contentful);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setResults();
    this.populateDefaultValue();
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (changes.value && changes.value.currentValue) {
      this.populateDefaultValue();
    }
  }

  itemSelected($event) {
    const event = $event && this.parseEvent($event);

    this.selected.emit(event);
  }

  private parseEvent($event) {
    const { entity } = $event;
    let asiNumber;
    let companyName;

    if (entity.fields.sponsoredBy) {
      asiNumber = entity.fields.sponsoredBy.fields.asiNumber;
      companyName = entity.fields.sponsoredBy.fields.companyName;
    }

    const products = entity.fields.products
      ? entity.fields.products.map((product) => ({
          title: product.fields.title,
          description: documentToHtmlString(product.fields.description),
          id: product.fields.productId,
        }))
      : [];

    const footer = entity.fields.footer
      ? documentToHtmlString(entity.fields.footer)
      : '';

    const event: ContentfulTypeaheadEvent = {
      article: {
        title: $event.title,
        description: documentToHtmlString(entity.fields.description),
        footer,
        products,
        shortDescription: entity.fields.shortDescription,
        sponsoredBy: {
          asiNumber,
          companyName,
        },
      },
      contentfulArticle: entity,
    };

    return event;
  }

  private resultsFilter = () =>
    map((res: EntryCollection<unknown>) => res.items.map(this.transformEntity));

  private transformEntity = (entity) =>
    entity && {
      id: entity.sys.id,
      title: entity.fields.title,
      entity: entity,
    };

  private populateDefaultValue() {
    if (
      this.value &&
      !this.angularJsBindingRegex.test(this.value) &&
      (!this.typeaheadValue || this.value !== this.typeaheadValue.id) &&
      this.loadingValue !== this.value &&
      this.contentful.hasClient
    ) {
      this.loadingValue = this.value;

      this.contentful
        .getEntity(this.value)
        .pipe(map(this.transformEntity))
        .subscribe(
          (val) => {
            if (val) {
              this.typeaheadValue = val;

              this.load.next(this.parseEvent(val));
            }

            this.searchValue.next('');
            this.loadingValue = undefined;
          },
          (e) => {
            this.errorHandler(e);
          }
        );
    }
  }

  private setResults() {
    this.results$ = <Observable<MappedContentfulEntity[]>>this.searchValue.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((query) => {
        const params: any = { ...this.params, query };

        if (this.contentType) {
          params.content_type = this.contentType;
        }

        if (this.sponsoredByAsiNumber && this.contentType) {
          params[this.sponsoredByIdQueryPath] = this.sponsoredById;
          params[this.asiNumberQueryPath] = this.sponsoredByAsiNumber;
        }

        return this.contentful.getEntities(params);
      }),
      this.resultsFilter(),
      catchError((e, caught) => {
        this.errorHandler(e);

        return of(null);
      }),
      tap(() => (this.searching = false)),
      map((entities) => entities.slice(0, this.numberOfResults))
    );
  }
}
