import { Injectable } from '@angular/core';
import {
    Action,
    Selector,
    State,
    StateContext
} from '@ngxs/store';

import { SearchCriteria } from '@esp/search';

import { <%=capitalize(name)%>Search } from '../../models';
import { <%=capitalize(name)%>Service } from '../../services/orders.service';

import { Search<%=capitalize(name)%>, SearchSuccess } from './actions';
import { <%=capitalize(name)%>SearchStateModel } from './model';

@State<<%=capitalize(name)%>SearchStateModel>({
    name: 'search',
    defaults: {
        error: null,
        pending: false,
        criteria: new SearchCriteria(),
        Results: null,
        ResultsTotal: 0,
        Aggregations: null,
    },
})
@Injectable()
export class <%=capitalize(name)%>SearchState {
    constructor(private _<%=camelize(name)%>Service: <%=capitalize(name)%>Service) { }

    /**
     * Selectors
     */
    @Selector()
    static getCriteria(state: <%=capitalize(name)%>SearchStateModel) {
        return state.criteria;
    }

    @Selector()
    static getResults(state: <%=capitalize(name)%>SearchStateModel) {
        return state.Results;
    }

    @Selector()
    static getSearchResult(state: <%=capitalize(name)%>SearchStateModel) {
        return state; // as SearchResult<Order>;
    }

    /**
     * Commands
     */
    @Action(Search<%=capitalize(name)%>)
    search(ctx: StateContext<<%=capitalize(name)%>SearchStateModel>, event: Search<%=capitalize(name)%>) {
        ctx.patchState({
            pending: true,
            ...event,
        });

        this._<%=camelize(name)%>Service
            .query<<%=capitalize(name)%>Search>(event.criteria)
            .toPromise()
            .then(res => {
                if (res) {
                    ctx.dispatch(new SearchSuccess(res));
                }
            });
    }

    /**
     * Events
     */
    @Action(SearchSuccess)
    setStateOnSearchSuccess(
        ctx: StateContext<<%=capitalize(name)%>SearchStateModel>,
        event: SearchSuccess
    ) {
        ctx.patchState({
            pending: false,
            ...event.result,
        });
    }
}
