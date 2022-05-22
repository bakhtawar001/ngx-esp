import { UrlQueryParameterConverter } from './url-query-parameter';

export const numberQueryParamConverter: UrlQueryParameterConverter<number> = {
  fromQuery: (queryParameterValues: string[], defaultValue: number) =>
    queryParameterValues?.length > 0
      ? parseInt(queryParameterValues[0], 10)
      : defaultValue,
  toQuery: (value: number) => (value > 1 ? [value.toString()] : []),
};
