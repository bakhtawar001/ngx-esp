import { Data, Route } from '@angular/router';
import { DefaultRouteData } from './default-route-data';

export interface TypedRoute<
  TCustomRouteData extends Data = DefaultRouteData,
  TDefaultRouteData extends Data = DefaultRouteData
> extends Route {
  children?: TypedRoute<TCustomRouteData & TDefaultRouteData>[];
  data?: TCustomRouteData & TDefaultRouteData;
}
