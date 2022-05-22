import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asiFormatToPercentage',
})
export class AsiFormatToPercentagePipe implements PipeTransform {
  transform(value: number | undefined): string {
    return (value ? `${value * 100}` : '0') + '%';
  }
}

@NgModule({
  declarations: [AsiFormatToPercentagePipe],
  exports: [AsiFormatToPercentagePipe],
})
export class AsiFormatToPercentageModule {}
