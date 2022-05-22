import { Injectable } from '@angular/core';
import {
  numberQueryParamConverter,
  stringQueryParamConverter,
  urlQueryParameter,
} from '@cosmos/state';
import { SearchLocalState } from './search.local-state';

@Injectable()
export abstract class SearchPageLocalState<
  T extends object = any
> extends SearchLocalState<T> {
  from = urlQueryParameter<number>('page', {
    defaultValue: 1,
    debounceTime: 0,
    converter: numberQueryParamConverter,
  });

  override term = urlQueryParameter<string>('q', {
    defaultValue: '',
    debounceTime: 0,
    converter: stringQueryParamConverter,
  });
}
