import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytes',
})
export class BytesPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {number} bytes
   * @param {number} float
   * @returns {any}
   */
  transform(bytes: number, float: number = 2): string {
    if (0 === bytes) return '0 Bytes';

    const c = 0 > float ? 0 : float,
      d = Math.floor(Math.log(bytes) / Math.log(1024));

    return (
      parseFloat((bytes / Math.pow(1024, d)).toFixed(c)) +
      ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
    );
  }
}

@NgModule({
  declarations: [BytesPipe],
  exports: [BytesPipe],
})
export class BytesPipeModule {}
