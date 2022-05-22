import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'websiteUrl',
})
export class WebsiteUrlPipe implements PipeTransform {
  transform(url: string): string {
    let ret = url;
    if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
      ret = 'http://' + url;
    }
    return ret;
  }
}

@NgModule({
  declarations: [WebsiteUrlPipe],
  exports: [WebsiteUrlPipe]
})
export class WebsiteUrlPipeModule {}
