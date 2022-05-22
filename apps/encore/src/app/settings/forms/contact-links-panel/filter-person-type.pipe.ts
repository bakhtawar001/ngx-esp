import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { LinkRelationship } from '@esp/models';

@Pipe({
  name: 'filterPersonTypePipe',
})
export class FilterPersonTypePipe implements PipeTransform {
  transform(links: LinkRelationship[]): LinkRelationship[] {
    return links?.filter((link) => !!link.To.IsPerson) || [];
  }
}

@NgModule({
  declarations: [FilterPersonTypePipe],
  exports: [FilterPersonTypePipe],
})
export class FilterPersonTypePipeModule {}
