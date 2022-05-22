import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { LookupTypeKey } from '../models';
import { LookupTypeQueries } from '../queries';

type LookupTypeKeys = 'Code' | 'Name' | 'Description';

@Pipe({ name: 'findLookupTypeValue' })
export class FindLookupTypeValuePipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {string} url
   * @param {LookupTypeKey} lookupType
   * @param {LookupTypeKeys} lookupKey
   * @param {LookupTypeKeys} returnKey
   * @returns {string}
   */
  constructor(private store: Store) {}

  transform(
    value: string,
    lookupType: LookupTypeKey,
    lookupKey: LookupTypeKeys = 'Code',
    returnKey: LookupTypeKeys = 'Name'
  ): string {
    const lookupValues: any[] = this.store?.selectSnapshot(
      LookupTypeQueries.lookups[lookupType as string]
    );

    if (value && lookupValues) {
      const _val = lookupValues.find((val) => val[lookupKey] === value)?.[
        returnKey
      ];

      return _val ?? value;
    }

    return value;
  }
}

@NgModule({
  declarations: [FindLookupTypeValuePipe],
  exports: [FindLookupTypeValuePipe],
})
export class FindLookupTypeValuePipeModule {}
