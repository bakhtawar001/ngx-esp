import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'formatLastUpdateDate',
})
export class FormatLastUpdateDatePipe implements PipeTransform {
  transform(product: any, args?: any): any {
    let lastUpdateDate = null;

    if (product && product.UpdateDate && product.UpdateDate !== 'None') {
      const displayDate = formatDate(product.UpdateDate, 'longDate', 'en-US');

      const labels = {
        today: 'Today',
        yesterday: 'Yesterday',
        overAYear: 'Over a Year',
        realTime: displayDate,
        defaultLabel: displayDate,
      };

      lastUpdateDate = {
        label: 'Last updated: ',
        display: labels.defaultLabel,
      };

      const updateDate = Date.parse(product.UpdateDate);
      const todaysDate = new Date().getTime();

      if (updateDate > new Date(todaysDate - 24 * 60 * 60 * 1000).valueOf()) {
        // today
        lastUpdateDate.display = labels.today;
      } else if (
        updateDate > new Date(todaysDate - 48 * 60 * 60 * 1000).valueOf()
      ) {
        // yesterday
        lastUpdateDate.display = labels.yesterday;
      } else if (
        updateDate <= new Date(todaysDate - 365 * 24 * 60 * 60 * 1000).valueOf()
      ) {
        // last year
        lastUpdateDate.display = labels.overAYear;
      }
      if (product.HasProductFeed) {
        lastUpdateDate.label = 'Last updated by Supplier: ';
        lastUpdateDate.display = labels.realTime;
      }

      return lastUpdateDate.label + lastUpdateDate.display;
    }

    return lastUpdateDate;
  }
}

@NgModule({
  declarations: [FormatLastUpdateDatePipe],
  exports: [FormatLastUpdateDatePipe],
})
export class FormatLastUpdateDatePipeModule {}
