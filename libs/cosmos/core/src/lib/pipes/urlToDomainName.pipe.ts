import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UrlToDomainName' })
export class UrlToDomainNamePipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {string} url
   * @param {any[]} args
   * @returns {string}
   */
  transform(url: string, args?: any): any {
    if (url) {
      if (url.length > 3) {
        let result;
        let match;
        if ((match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^:\/\n?=]+)/im))) {
          result = match[1];
          if ((match = result.match(/^[^.]+\.(.+\..+)$/))) result = match[1];
        }
        return result;
      }
      return url;
    }
    return url;
  }
}

@NgModule({
  declarations: [UrlToDomainNamePipe],
  exports: [UrlToDomainNamePipe],
})
export class UrlToDomainNamePipeModule {}
