import { NgModule, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'formatCount',
})
export class FormatCountPipe implements PipeTransform {
  transform(value: number): string {
    if (value) {
      return `(${value})`;
    }
    return null;
  }
}
//-------------------------------------------------------------------
// @NgModule
//---------------------------------------------------------------------
@NgModule({
  declarations: [FormatCountPipe],
  exports: [FormatCountPipe],
})
export class FormatCountPipeModule {}
