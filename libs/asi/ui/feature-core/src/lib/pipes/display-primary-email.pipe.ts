import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Party } from '@esp/models';

@Pipe({
  name: 'asiDisplayPrimaryEmail',
})
export class AsiDisplayPrimaryEmailPipe implements PipeTransform {
  transform(value: Partial<Party>): string {
    return value?.Emails?.filter((_) => _.IsPrimary)?.[0]?.Address || '-';
  }
}

@NgModule({
  declarations: [AsiDisplayPrimaryEmailPipe],
  exports: [AsiDisplayPrimaryEmailPipe],
})
export class AsiDisplayPrimaryEmailPipeModule {}
