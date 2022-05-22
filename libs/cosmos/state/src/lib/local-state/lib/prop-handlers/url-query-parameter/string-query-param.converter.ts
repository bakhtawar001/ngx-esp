import { UrlQueryParameterConverter } from './url-query-parameter';

export const stringQueryParamConverter: UrlQueryParameterConverter<string> = {
  fromQuery: (queryParameterValues: string[]) => queryParameterValues?.[0],
  toQuery: (value: string) => (value ? [value] : []),
};
