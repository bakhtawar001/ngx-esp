import { Injectable } from '@angular/core';
import {
    State,
    StateContext,
    Store,
    NgxsOnInit,
    Selector,
    Action,
} from '@ngxs/store';

import { <%=capitalize(name)%>StateModel } from './model';
import { <%=capitalize(name)%>SearchState } from './search';
import { <%=capitalize(name)%>Service } from '../services/<%=dasherize(name)%>.service';
import { GetById, GetByIdSuccess } from './actions';

@State<<%=capitalize(name)%>StateModel>({
    name: '<%=camelize(name)%>',
    defaults: {
        error: null,
        pending: false,
        <%=camelize(name)%>: null
    },
    children: [<%=capitalize(name)%>SearchState],
})
@Injectable()
export class <%=capitalize(name)%>State implements NgxsOnInit {
    constructor(private store: Store, private <%=camelize(name)%>Service: <%=capitalize(name)%>Service) { }

    /**
     * Selectors
     */
    @Selector()
    static get<%=capitalize(name)%>(state: <%=capitalize(name)%>StateModel) {
        return state.<%=camelize(name)%>;
    }

    /**
     * Dispatch CheckSession on start
     */
    ngxsOnInit(ctx: StateContext<<%=capitalize(name)%>StateModel>) {
        // ctx.dispatch(new CheckSession());
    }

    /**
     * Commands
     */
    @Action(GetById)
    getById(ctx: StateContext<<%=capitalize(name)%>StateModel>, event: GetById) {
        return this.<%=camelize(name)%>Service.get(event.id)
            .subscribe(res => ctx.dispatch(new GetByIdSuccess(res)));
    }

    /**
     * Events
     */
    @Action(GetByIdSuccess)
    getByIdSuccess(ctx: StateContext<<%=capitalize(name)%>StateModel>, event: GetByIdSuccess) {
        ctx.patchState({
            <%=camelize(name)%>: event.res
        });
    }
}
