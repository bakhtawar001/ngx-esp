import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'trustHtml' })
export class TrustHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  /**
   * Transform
   *
   * @param {string} Document
   * @returns {SafeHtml}
   */
  transform(document: string): SafeHtml {
    try {
      return this.sanitizer.bypassSecurityTrustHtml(document);
    } catch (e) {
      console.log('errorhandler', e);
      return '';
    }
  }
}

@NgModule({
  declarations: [TrustHtmlPipe],
  exports: [TrustHtmlPipe],
})
export class TrustHtmlPipeModule {}
