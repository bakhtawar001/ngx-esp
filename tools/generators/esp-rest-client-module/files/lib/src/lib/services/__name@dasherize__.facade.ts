import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { <%=capitalize(name)%>SearchState, <%=capitalize(name)%>SearchStateModel, Search<%=capitalize(name)%> } from '../store/search';
import { Observable } from 'rxjs';
import { SearchCriteria } from '@esp/search';
import { <%=capitalize(name)%>, <%=capitalize(name)%>Search } from '../models';
import { <%=capitalize(name)%>State, Get<%=capitalize(name)%>ById } from '../store';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root',
})
export class <%=capitalize(name)%>Facade {
    criteria$ = this.store.select(<%=capitalize(name)%>SearchState.getCriteria);
    results$ = this.store.select(<%=capitalize(name)%>SearchState.getResults).pipe(map(results => plainToClass(<%=capitalize(name)%>Search, results)));
    searchResult$ = this.store.select(<%=capitalize(name)%>SearchState.getSearchResult);
    selected$ = this.store.select(<%=capitalize(name)%>State.get<%=capitalize(name)%>).pipe(map(obj => plainToClass(<%=capitalize(name)%>, obj)));

    constructor(private store: Store) { }

    search(criteria$: Observable<SearchCriteria>): Observable<<%=capitalize(name)%>SearchStateModel> {
        criteria$.subscribe(criteria => this.store.dispatch(new Search<%=capitalize(name)%>(criteria)));

        return this.searchResult$;
    }

    getById(id: number): Observable<<%=capitalize(name)%>> {
        this.store.dispatch(new Get<%=capitalize(name)%>ById(id));

        return this.selected$;
    }
}
