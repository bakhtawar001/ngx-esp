import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import { ProductSearchActions, ProductSearchQueries } from '@esp/products';
import { syncGlobalSearchSetting } from '../../types';

@Injectable()
export class GlobalSearchLocalState extends LocalState<GlobalSearchLocalState> {
  searchType = syncGlobalSearchSetting('searchType', 'products');
  term = syncGlobalSearchSetting('term', '');
  keywordSuggestions = fromSelector(ProductSearchQueries.getKeywordSuggestions);

  getKeywordSuggestions = asDispatch(
    ProductSearchActions.LoadKeywordSuggestions
  );
}
