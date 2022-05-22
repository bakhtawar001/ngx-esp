import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';

@Pipe({
  name: 'cosElapsedTime',
})
export class CosElapsedTimePipe implements PipeTransform {
  transform(date: string): unknown {
    const currentDate = new Date();
    const updateDate = new Date(date);
    const duration = (ms: number) =>
      formatDistance(0, ms, { includeSeconds: true });
    return duration(currentDate.getTime() - updateDate.getTime());
  }
}

@NgModule({
  declarations: [CosElapsedTimePipe],
  exports: [CosElapsedTimePipe],
})
export class CosElapsedTimePipeModule {}
