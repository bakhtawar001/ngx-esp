import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'formatProp65Warning',
})
export class FormatProp65WarningPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}
  transform(value: any, args?: any): SafeHtml {
    const warningHtml = '<span class="safety-warning">PROP 65 WARNING:</span>';

    if (value.indexOf('WARNING:') === 0) {
      value = value.replace('WARNING:', warningHtml);
    } else if (value.indexOf('PROP 65 WARNING:') === 0) {
      value = value.replace('PROP 65 WARNING:', warningHtml);
    } else {
      value = '<span class="safety-warning">PROP 65 WARNING:</span> ' + value;
    }

    if (value.toLowerCase().indexOf('www.p65warnings.ca.gov') >= 0) {
      value = value.replace(
        /www.p65warnings.ca.gov|https:\/\/www.p65warnings.ca.gov/gi,
        '<a href="https://www.p65warnings.ca.gov" target="_blank">www.P65Warnings.ca.gov</a>'
      );
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@NgModule({
  declarations: [FormatProp65WarningPipe],
  exports: [FormatProp65WarningPipe],
})
export class FormatProp65WarningPipeModule {}
