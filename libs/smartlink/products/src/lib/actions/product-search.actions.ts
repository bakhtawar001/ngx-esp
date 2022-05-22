const ACTION_SCOPE = '[Smartlink ProductSearch]';

export namespace ProductSearchActions {
  export class LoadKeywordSuggestions {
    static readonly type = `${ACTION_SCOPE} Load Keyword Suggestions`;

    constructor(public params: any) {}
  }
}
