import { SearchCriteria, SearchResult } from '@esp/search';
import { <%=capitalize(name)%>Search } from '../../models';

// Actions
export class Search<%=capitalize(name)%> {
  static type = '[<%=capitalize(name)%>] Search';
  constructor(public criteria?: SearchCriteria | null) { }
}

// Events
export class SearchSuccess {
  static type = '[<%=capitalize(name)%>] SearchSuccess';
  constructor(public result: SearchResult<<%=capitalize(name)%>Search>) { }
}
