import { RouterSelectors } from './router-selectors';

describe('RouterSelector', () => {
  let state: any;
  let innerState: any;

  beforeEach(() => {
    state = {
      state: {
        data: 'test',
        url: 'test1',
        params: 'test2',
        queryParams: 'test3',
      },
    };

    innerState = state.state;
  });

  it('returns state.data', () => {
    const data = RouterSelectors.data(state);

    expect(data).toEqual(innerState.data);
  });

  it('returns state.params', () => {
    const data = RouterSelectors.params(state);

    expect(data).toEqual(innerState.params);
  });

  it('returns state.queryParams', () => {
    const data = RouterSelectors.queryParams(state);

    expect(data).toEqual(innerState.queryParams);
  });

  it('returns state.url', () => {
    const data = RouterSelectors.url(state);

    expect(data).toEqual(innerState.url);
  });
});
