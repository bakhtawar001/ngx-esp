import { SearchCriteria, SearchResult } from '@esp/search';

import { <%=capitalize(name)%>Search } from "../../models/search/<%=capitalize(name)%>-search.model";

export interface <%=capitalize(name)%>SearchStateModel extends SearchResult<<%=capitalize(name)%>Search> {
  error: string | null;
  pending: boolean;
  criteria: SearchCriteria | null;
}
