import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prop65',
})
export class Prop65Pipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    const warningHtml = '';
    // '<span class="header-style-14-bold product-attribute-header">PROP 65 WARNING:</span>';

    if (value.indexOf('WARNING:') === 0) {
      value = value.replace('WARNING:', warningHtml);
    } else if (value.indexOf('PROP 65 WARNING:') === 0) {
      value = value.replace('PROP 65 WARNING:', warningHtml);
    } else {
      value = warningHtml + value;
    }

    if (value.toLowerCase().indexOf('www.p65warnings.ca.gov') >= 0) {
      value = value.replace(
        /https:\/\/www.p65warnings.ca.gov|www.p65warnings.ca.gov/gi,
        '<a href="https://www.p65warnings.ca.gov" target="_blank">www.P65Warnings.ca.gov</a>'
      );
    }

    return value;
  }
}

@NgModule({
  declarations: [Prop65Pipe],
  exports: [Prop65Pipe],
})
export class Prop65PipeModule {}
