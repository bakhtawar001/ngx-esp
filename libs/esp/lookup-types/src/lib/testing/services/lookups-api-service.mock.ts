import { allLookupsApiProperties, LookupApiModel } from '../../services';

export function createLookupsApiResult(partial: Partial<LookupApiModel> = {}) {
  const modelWithDefaults = allLookupsApiProperties.reduce<LookupApiModel>(
    (map, prop) => ((map[prop] = []), map),
    {} as LookupApiModel
  );
  return { ...modelWithDefaults, ...partial };
}
