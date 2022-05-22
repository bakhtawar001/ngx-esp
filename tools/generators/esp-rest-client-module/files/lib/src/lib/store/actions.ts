import { <%= capitalize(name) %> } from '../models';

export class GetById {
    static type = '[<%= capitalize(name) %>State] Get<%= capitalize(name) %>ById';
    constructor(public id: number) { }
}

export class GetByIdSuccess {
    static type = '[<%= capitalize(name) %>State] Get<%= capitalize(name) %>ByIdSuccess';
    constructor(public res: <%= capitalize(name) %>) { }
}
