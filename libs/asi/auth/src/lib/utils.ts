import { HttpRequest } from '@angular/common/http';
import { some } from 'lodash-es';

export const requestStartsWith = (urls: string[]) => (req: HttpRequest<any>) =>
  some(urls, (url) => req.url.startsWith(url));
