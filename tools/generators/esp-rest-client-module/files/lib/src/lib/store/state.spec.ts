import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule, Actions, Store } from '@ngxs/store';
import { <%=capitalize(name) %>State } from './state';
import { <%=capitalize(name) %>SearchState } from './search';
import { <%=capitalize(name) %>Service } from '../services';

describe('<%=capitalize(name)%>State', () => {
    let actions$;
    let http;
    let state;
    let store;
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, NgxsModule.forRoot([<%=capitalize(name) %> State, <%=capitalize(name) %>SearchState])],
            providers: [<%=capitalize(name) %>Service]
        });

        actions$ = TestBed.inject(Actions);

        http = TestBed.inject(HttpTestingController);

        store = TestBed.inject(Store);

        service = TestBed.inject(<%=capitalize(name) %>Service);

        state = {};

        store.reset({ <%=decamelize(name) %>: state })
    });

    it('creates a store', () => {
        expect(store).toBeTruthy();
    });

    describe('Selectors', () => {

    });

    describe('Commands', () => {

    });

    describe('Events', () => {

    });
});