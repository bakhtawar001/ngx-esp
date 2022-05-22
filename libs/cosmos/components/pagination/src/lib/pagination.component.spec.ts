import { MatDividerModule } from '@angular/material/divider';
import {
  byTextContent,
  createComponentFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { CosPaginationComponent } from './pagination.component';

const getPageNumbersNormalizedDisplayValue = (
  spectator: Spectator<CosPaginationComponent>
): string => {
  return spectator
    .queryAll('.page-number')
    .map((e) => e.textContent.trim())
    .join(' ');
};

describe('CosPaginationComponent', () => {
  let component: CosPaginationComponent;

  let spectator: Spectator<CosPaginationComponent>;
  const createComponent = createComponentFactory({
    component: CosPaginationComponent,
    imports: [MatDividerModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the correct page numbers for a very long results set', () => {
    component.length = 63606;
    component.pageSize = 30;
    component.maxPageNumbers = 12;

    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([[1, 2, 3, 4], [], [2120, 2121]]);
    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe(
      '1 2 3 4 ... 2120 2121'
    );
  });

  it('should calculate the correct page numbers for a shorter results set', () => {
    component.length = 300;
    component.pageSize = 30;
    component.maxPageNumbers = 12;

    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]);

    // Check that no ellipses are displayed
    const ellipseElements = spectator.queryAll('.ellipse');
    expect(ellipseElements.length).toEqual(0);

    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe(
      '1 2 3 4 5 6 7 8 9 10'
    );
  });

  it('should not display if there would be only a single page', () => {
    component.length = 22;
    component.pageSize = 30;
    component.maxPageNumbers = 12;

    spectator.detectChanges();

    const container = spectator.debugElement.nativeElement;

    expect(container.length).toBeFalsy();
  });

  it('Pagination should be available on Collection details page with 50 products per page', () => {
    component.length = 55;
    spectator.detectChanges();
    expect(component.totalPages).toBeGreaterThan(1);
    const paginationComponent = spectator.query('.button-container');
    expect(paginationComponent).toExist();
  });

  it('should set correct page on prev, next click', () => {
    component.length = 55;
    component.pageSize = 5;
    component.pageIndex = 5;
    spectator.detectChanges();

    const nextPrevButton = spectator.queryAll('.next-prev-button');
    expect(nextPrevButton.length).toBe(2);

    const prevButton = nextPrevButton[0];
    const nextButton = nextPrevButton[1];
    spectator.click(prevButton);
    spectator.detectChanges();
    expect(component.pageIndex).toBe(4);

    spectator.click(nextButton);
    spectator.detectChanges();
    expect(component.pageIndex).toBe(5);
  });

  it('should calculate the correct page numbers for 1000 results', () => {
    component.length = 1000;
    component.pageSize = 48;
    component.maxPageNumbers = 6;
    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([[1, 2, 3, 4], [], [20, 21]]);
    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe(
      '1 2 3 4 ... 20 21'
    );
  });

  it('should always display all page numbers if their number is less than 6', () => {
    component.length = 50;
    component.pageSize = 10;
    component.maxPageNumbers = 2;
    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([[1, 2, 3, 4, 5]]);
    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe('1 2 3 4 5');
  });

  it('should display all page numbers when their number is not less than 6, but not greater than max defined', () => {
    component.length = 70;
    component.pageSize = 10;
    component.maxPageNumbers = 8;
    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([[1, 2, 3, 4, 5, 6, 7]]);
    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe(
      '1 2 3 4 5 6 7'
    );
  });

  it('should display first 4 page numbers and 2 last if second page is active', () => {
    component.length = 60;
    component.pageSize = 6;
    component.maxPageNumbers = 5;
    component.pageIndex = 1; // 2nd page
    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([[1, 2, 3, 4], [], [9, 10]]);
    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe(
      '1 2 3 4 ... 9 10'
    );
  });

  it('should display first 2 page numbers, 4 around active page and 2 last if middle page is active', () => {
    component.length = 66;
    component.pageSize = 6;
    component.maxPageNumbers = 5;
    component.pageIndex = 5; // 6th page
    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([
      [1, 2],
      [4, 5, 6, 7, 8],
      [10, 11],
    ]);
    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe(
      '1 2 ... 4 5 6 7 8 ... 10 11'
    );
  });

  it('should display first 2 page numbers and 4 last if the last page is active', () => {
    component.length = 60;
    component.pageSize = 6;
    component.maxPageNumbers = 5;
    component.pageIndex = 9; // 10th page
    spectator.detectChanges();

    // Check that the list of pages is correct for this input
    expect(component.pages).toEqual([[1, 2], [], [7, 8, 9, 10]]);
    expect(getPageNumbersNormalizedDisplayValue(spectator)).toBe(
      '1 2 ... 7 8 9 10'
    );
  });

  it('should display page indicator for mobile variant', () => {
    component.variant = 'small';
    component.length = 60;
    component.pageSize = 6;
    component.maxPageNumbers = 5;
    component.pageIndex = 3; // 4th page
    spectator.detectChanges();

    const pageIndicator = spectator.query('.cos-pagination-page-indicator');

    expect(spectator.query('.cos-pagination-page-links')).toBeFalsy();
    expect(pageIndicator).toBeTruthy();
    expect(pageIndicator).toHaveText('4 of 10');
  });
});
