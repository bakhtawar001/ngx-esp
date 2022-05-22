import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';

@Pipe({ name: 'documentToHtml' })
export class DocumentToHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  /**
   * Transform
   *
   * @param {any} Document
   * @returns {SafeHtml}
   */
  transform(document: Document): SafeHtml {
    try {
      return this.sanitizer.bypassSecurityTrustHtml(
        documentToHtmlString(document)
      );
    } catch (e) {
      console.log('errorhandler', e);
      return '';
    }
  }
}

@NgModule({
  declarations: [DocumentToHtmlPipe],
  exports: [DocumentToHtmlPipe],
})
export class DocumentToHtmlPipeModule {}
