import { RouterStateSnapshot, UrlSegment } from '@angular/router';
import { CustomRouterStateSerializer } from './router-state.serializer';

describe('RouterStateSerializer', () => {
  let routerState: RouterStateSnapshot;
  let serializer: CustomRouterStateSerializer;

  beforeEach(() => {
    serializer = new CustomRouterStateSerializer();

    routerState = {
      url: 'test',
      root: {
        url: [new UrlSegment('/', {})],
        queryParams: {},
        params: {},
        fragment: null,
        data: {},
        outlet: '',
        component: null,
        routeConfig: null,
        root: null!,
        parent: null,
        children: null!,
        firstChild: null,
        pathFromRoot: null!,
        paramMap: null!,
        queryParamMap: null!,
      },
    };
  });

  it('serializes route', () => {
    const res = serializer.serialize(routerState);

    expect(res).toMatchObject({
      url: routerState.url,
      params: routerState.root.params,
      queryParams: routerState.root.queryParams,
      data: routerState.root.data,
    });
  });

  it('sets title', () => {
    routerState.root.params.title = 'tttt';

    const res = serializer.serialize(routerState);

    expect(res).toMatchObject({
      url: routerState.url,
      params: routerState.root.params,
      queryParams: routerState.root.queryParams,
      data: routerState.root.data,
    });

    expect(res.data.title).toEqual(routerState.root.params.title);
  });
});
