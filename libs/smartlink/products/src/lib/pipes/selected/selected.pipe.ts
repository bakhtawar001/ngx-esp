import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selected',
  // eslint-disable-next-line @angular-eslint/no-pipe-impure
  pure: false,
})
export class SelectedPipe implements PipeTransform {
  transform(item: any, collection: any[]): boolean {
    return collection.find((x) => {
      if (x?.Id) {
        return x.Id === item.Id;
      }
      return x === item.Id;
    });
  }
}

@NgModule({
  declarations: [SelectedPipe],
  exports: [SelectedPipe],
})
export class SelectedPipeModule {}
