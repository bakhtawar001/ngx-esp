import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'cos-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-pagination',
  },
})
// Refactor so that the component extends the paginator rather than inject it. Then this.paginator would become just "this"
export class CosPaginationComponent extends MatPaginator {
  private _pages?: Array<Array<number>>;
  private _nonConsecutive?: Array<boolean>;

  @Input() maxPageNumbers = 0;
  @Input() variant = '';

  // The page index is 0-based, which is why the current page is one more than the index.
  get currentPage() {
    return this.pageIndex + 1;
  }

  get totalPages() {
    return this.getNumberOfPages();
  }

  // Returns a list of pages to appear on the paginator
  // Formatted as nested arrays
  get pages(): Array<Array<number>> {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const allPages = [];
    const firstPages = [];
    const middlePages = [];
    const lastPages = [totalPages - 1, totalPages];
    // max page numbers needs to be at least equal to total pages if their number is less than 6
    // as otherwise sets will overlap producing incorrect results, e.g. [[1,2,3,4],[3,4]]
    const maxPageNumbers = totalPages <= 5 ? totalPages : this.maxPageNumbers;

    // If the total number of pages is max or less, output all the numbers.
    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        firstPages.push(i);
      }
      return [firstPages];
    }

    // If there are more than max pages, continue.

    // Determine which pages appear at the beginning of the series.
    // We always show the first two pages.
    firstPages.push(1, 2);
    if (currentPage <= 2) {
      // If the current page is first or second, we want to show the first four pages
      firstPages.push(3, 4);
    }

    // Determine which pages appear at the end of the series
    if (currentPage >= totalPages - 1) {
      // If the current page is last or next to last, we want to show the last four pages
      lastPages.unshift(totalPages - 3, totalPages - 2);
    }

    // Determine which pages, if any, appear in the middle of the series
    if (currentPage > 2 && currentPage < totalPages - 1) {
      // Put in the current page, plus two before and two after
      // -- but only if they're not already in one of the other lists.
      for (let i = currentPage - 2; i < currentPage + 3; i++) {
        if (!firstPages.concat(lastPages).includes(i)) {
          middlePages.push(i);
        }
      }
    }

    // Compile the final array
    allPages.push(firstPages);
    allPages.push(middlePages);
    allPages.push(lastPages);
    this._pages = allPages;
    return this._pages;
  }

  // Returns whether the lists are non-consecutive.
  // This drives the ellipses in the page list.
  // Returns an array of the two comparison results.
  get nonConsecutive() {
    let first;
    let last;

    // This isn't necessary if there is only one list of numbers.
    if (this.pages.length === 1) {
      return [false, false];
    }

    const finalFirstValue = this.pages[0][this.pages[0].length - 1];
    const hasMiddle = this.pages[1].length > 0;
    const secondListIndex = hasMiddle ? 1 : 2;
    const finalMiddleValue =
      hasMiddle && this.pages[1][this.pages[1].length - 1];

    // Compares the last value in the first array with the first value in the next array
    if (finalFirstValue !== this.pages[secondListIndex][0] - 1) {
      first = true;
    }

    // Compares the last value in the middle array (if exists) with the first value in the last array
    if (hasMiddle && finalMiddleValue !== this.pages[2][0] - 1) {
      last = true;
    }

    this._nonConsecutive = [<boolean>first, <boolean>last];
    return this._nonConsecutive;
  }

  goToPage(pageNumber: number): void {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = pageNumber - 1;
    this._emitMatPageEvent(previousPageIndex);
  }

  /** Copied from parent component "_emitPageEvent", as it would not be inherited by child */
  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  private _emitMatPageEvent(previousPageIndex: number) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
