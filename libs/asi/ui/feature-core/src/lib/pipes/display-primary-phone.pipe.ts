import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Party } from '@esp/models';

@Pipe({
  name: 'asiDisplayPrimaryPhone',
})
export class AsiDisplayPrimaryPhonePipe implements PipeTransform {
  transform(value: Partial<Party>): string {
    return value?.Phones?.filter((_) => _.IsPrimary)?.[0]?.Number || '-';
  }
}

@NgModule({
  declarations: [AsiDisplayPrimaryPhonePipe],
  exports: [AsiDisplayPrimaryPhonePipe],
})
export class AsiDisplayPrimaryPhonePipeModule {}
