import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BehaviorSubject, Observable } from 'rxjs';
import { CosTableComponent } from './table.component';
import { CosTableModule } from './table.module';

@Component({
  template: `
    <table cos-table [dataSource]="dataSource" class="native-table">
      <ng-container cosColumnDef="column_a">
        <th cosHeaderCell *cosHeaderCellDef>Column A</th>
        <td cosCell *cosCellDef="let row">{{ row.a }}</td>
      </ng-container>
      <ng-container cosColumnDef="column_b">
        <th cosHeaderCell *cosHeaderCellDef>Column B</th>
        <td cosCell *cosCellDef="let row">{{ row.b }}</td>
      </ng-container>
      <ng-container cosColumnDef="column_c">
        <th cosHeaderCell *cosHeaderCellDef>Column C</th>
        <td cosCell *cosCellDef="let row">{{ row.c }}</td>
      </ng-container>
      <tr
        cos-header-row
        class="cos-header-row"
        *cosHeaderRowDef="columnsToRender"
      ></tr>
      <tr cos-row *cosRowDef="let row; columns: columnsToRender"></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NativeTableComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  @ViewChild(CosTableComponent, { static: true })
  table!: CosTableComponent<TestData>;
}

@Component({
  template: `
    <table cos-table [dataSource]="dataSource" class="nested-table">
      <ng-container cosColumnDef="column_a">
        <th cosHeaderCell *cosHeaderCellDef>Column A</th>
        <td cosCell *cosCellDef="let row">{{ row.a }}</td>
      </ng-container>
      <ng-container cosColumnDef="column_b">
        <th cosHeaderCell *cosHeaderCellDef>Column B</th>
        <td cosCell *cosCellDef="let row">
          <table cos-table [dataSource]="dataSource">
            <ng-container cosColumnDef="column_a">
              <th cosHeaderCell *cosHeaderCellDef>Column A</th>
              <td cosCell *cosCellDef="let row">{{ row.a }}</td>
            </ng-container>
            <ng-container cosColumnDef="column_b">
              <th cosHeaderCell *cosHeaderCellDef>Column B</th>
              <td cosCell *cosCellDef="let row">{{ row.b }}</td>
            </ng-container>
            <ng-container cosColumnDef="column_c">
              <th cosHeaderCell *cosHeaderCellDef>Column C</th>
              <td cosCell *cosCellDef="let row">{{ row.c }}</td>
            </ng-container>
            <tr cos-header-row *cosHeaderRowDef="columnsToRender"></tr>
            <tr cos-row *cosRowDef="let row; columns: columnsToRender"></tr>
          </table>
        </td>
      </ng-container>
      <ng-container cosColumnDef="column_c">
        <th cosHeaderCell *cosHeaderCellDef>Column C</th>
        <td cosCell *cosCellDef="let row">{{ row.c }}</td>
      </ng-container>
      <tr cos-header-row *cosHeaderRowDef="columnsToRender"></tr>
      <tr cos-row *cosRowDef="let row; columns: columnsToRender"></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NestedTableComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];

  @ViewChild(CosTableComponent, { static: true })
  table!: CosTableComponent<TestData>;
}

@Component({
  template: `
    <cos-table [dataSource]="dataSource" class="cos-table">
      <ng-container cosColumnDef="column_a">
        <cos-header-cell *cosHeaderCellDef> Column A</cos-header-cell>
        <cos-cell *cosCellDef="let row"> {{ row.a }}</cos-cell>
        <cos-footer-cell *cosFooterCellDef> Footer A</cos-footer-cell>
      </ng-container>
      <ng-container cosColumnDef="column_b">
        <cos-header-cell *cosHeaderCellDef> Column B</cos-header-cell>
        <cos-cell *cosCellDef="let row"> {{ row.b }}</cos-cell>
        <cos-footer-cell *cosFooterCellDef> Footer B</cos-footer-cell>
      </ng-container>
      <ng-container cosColumnDef="column_c">
        <cos-header-cell *cosHeaderCellDef> Column C</cos-header-cell>
        <cos-cell *cosCellDef="let row"> {{ row.c }}</cos-cell>
        <cos-footer-cell *cosFooterCellDef> Footer C</cos-footer-cell>
      </ng-container>
      <ng-container cosColumnDef="special_column">
        <cos-cell *cosCellDef="let row"> fourth_row </cos-cell>
      </ng-container>
      <cos-header-row *cosHeaderRowDef="columnsToRender"></cos-header-row>
      <cos-row *cosRowDef="let row; columns: columnsToRender"></cos-row>
      <cos-row
        *cosRowDef="let row; columns: ['special_column']; when: isFourthRow"
      ></cos-row>
      <cos-footer-row *cosFooterRowDef="columnsToRender"></cos-footer-row>
    </cos-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosTableAppComponent {
  dataSource: FakeDataSource | null = new FakeDataSource();
  columnsToRender = ['column_a', 'column_b', 'column_c'];
  isFourthRow = (i: number, _rowData: TestData) => i === 3;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(CosTableComponent, { static: true })
  table!: CosTableComponent<TestData>;
}

@Component({
  template: `
    <cos-table
      [dataSource]="dataSource"
      [multiTemplateDataRows]="multiTemplateDataRows"
      class="cos-table"
    >
      <ng-container cosColumnDef="column_a">
        <cos-header-cell *cosHeaderCellDef> Column A</cos-header-cell>
        <cos-cell *cosCellDef="let row"> {{ row.a }}</cos-cell>
        <cos-footer-cell *cosFooterCellDef> Footer A</cos-footer-cell>
      </ng-container>
      <ng-container cosColumnDef="special_column">
        <cos-cell *cosCellDef="let row"> fourth_row </cos-cell>
      </ng-container>
      <cos-header-row *cosHeaderRowDef="['column_a']"></cos-header-row>
      <cos-row *cosRowDef="let row; columns: ['column_a']"></cos-row>
      <cos-row
        *cosRowDef="let row; columns: ['special_column']; when: isFourthRow"
      ></cos-row>
      <cos-footer-row *cosFooterRowDef="['column_a']"></cos-footer-row>
    </cos-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class CosTableWithWhenRowApp {
  multiTemplateDataRows = false;
  dataSource: FakeDataSource | null = new FakeDataSource();
  isFourthRow = (i: number, _rowData: TestData) => i === 3;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(CosTableComponent) table!: CosTableComponent<TestData>;
}

/* ************************************
/* Utilities for testing convenience */
/************************************/
// eslint-disable-next-line @angular-eslint/component-class-suffix
class FakeDataSource extends DataSource<TestData> {
  _dataChange = new BehaviorSubject<TestData[]>([]);
  get data() {
    return this._dataChange.getValue();
  }
  set data(data: TestData[]) {
    this._dataChange.next(data);
  }

  constructor() {
    super();
    for (let i = 0; i < 4; i++) {
      this.addData();
    }
  }

  connect(): Observable<TestData[]> {
    return this._dataChange;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}

  addData() {
    const nextIndex = this.data.length + 1;

    const copiedData = this.data.slice();
    copiedData.push({
      a: `a_${nextIndex}`,
      b: `b_${nextIndex}`,
      c: `c_${nextIndex}`,
    });

    this.data = copiedData;
  }
}

interface TestData {
  a: string | number | undefined;
  b: string | number | undefined;
  c: string | number | undefined;
}

function getElements(element: Element, query: string): Element[] {
  return [].slice.call(element.querySelectorAll(query));
}

function getHeaderRows(tableElement: Element): Element[] {
  return [].slice.call(tableElement.querySelectorAll('.cos-header-row'))!;
}

function getFooterRows(tableElement: Element): Element[] {
  return [].slice.call(tableElement.querySelectorAll('.cos-footer-row'))!;
}

function getRows(tableElement: Element): Element[] {
  return getElements(tableElement, '.cos-row');
}

function getCells(row: Element): Element[] {
  if (!row) {
    return [];
  }

  let cells = getElements(row, 'cos-cell');
  if (!cells.length) {
    cells = getElements(row, 'td');
  }

  return cells;
}

function getHeaderCells(headerRow: Element): Element[] {
  let cells = getElements(headerRow, 'cos-header-cell');
  if (!cells.length) {
    cells = getElements(headerRow, 'th');
  }

  return cells;
}

function getFooterCells(footerRow: Element): Element[] {
  let cells = getElements(footerRow, 'cos-footer-cell');
  if (!cells.length) {
    cells = getElements(footerRow, 'td');
  }

  return cells;
}

function getActualTableContent(tableElement: Element): string[][] {
  let actualTableContent: Element[][] = [];
  getHeaderRows(tableElement).forEach((row) => {
    actualTableContent.push(getHeaderCells(row));
  });

  // Check data row cells
  const rows = getRows(tableElement).map((row) => getCells(row));
  actualTableContent = actualTableContent.concat(rows);
  getFooterRows(tableElement).forEach((row) => {
    actualTableContent.push(getFooterCells(row));
  });

  // Convert the nodes into their text content;
  return actualTableContent.map((row) =>
    row.map((cell) => cell.textContent!.trim())
  );
}

export function expectTableToMatchContent(
  tableElement: Element,
  expected: any[]
) {
  const missedExpectations: string[] = [];
  function checkCellContent(actualCell: string, expectedCell: string) {
    if (actualCell !== expectedCell) {
      missedExpectations.push(
        `Expected cell contents to be ${expectedCell} but was ${actualCell}`
      );
    }
  }

  const actual = getActualTableContent(tableElement);

  // Make sure the number of rows cosCh
  if (actual.length !== expected.length) {
    missedExpectations.push(
      `Expected ${expected.length} total rows but got ${actual.length}`
    );
    fail(missedExpectations.join('\n'));
  }

  actual.forEach((row, rowIndex) => {
    const expectedRow = expected[rowIndex];

    // Make sure the number of cells cosCh
    if (row.length !== expectedRow.length) {
      missedExpectations.push(
        `Expected ${expectedRow.length} cells in row but got ${row.length}`
      );
      fail(missedExpectations.join('\n'));
    }

    row.forEach((actualCell, cellIndex) => {
      const expectedCell = expectedRow ? expectedRow[cellIndex] : null;
      checkCellContent(actualCell, expectedCell);
    });
  });

  if (missedExpectations.length) {
    fail(missedExpectations.join('\n'));
  }
}

describe('CosTable', () => {
  describe('CosTable - Basic Html Table', () => {
    let spectator: Spectator<NativeTableComponent>;
    let component: NativeTableComponent;
    const createComponent = createComponentFactory({
      component: NativeTableComponent,
      imports: [CosTableModule],
    });
    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;
    });

    it('should be able to render a table correctly with native elements', () => {
      const tableElement = spectator.query('.native-table');
      const data = component.dataSource!.data;
      expectTableToMatchContent(tableElement!, [
        ['Column A', 'Column B', 'Column C'],
        [data[0].a, data[0].b, data[0].c],
        [data[1].a, data[1].b, data[1].c],
        [data[2].a, data[2].b, data[2].c],
        [data[3].a, data[3].b, data[3].c],
      ]);
    });
  });

  describe('CosTable - Basic Html Nested Table', () => {
    let spectator: Spectator<NestedTableComponent>;
    const createComponent = createComponentFactory({
      component: NestedTableComponent,
      imports: [CosTableModule],
    });
    beforeEach(() => {
      spectator = createComponent();
    });

    it('should be able to nest tables', () => {
      const outerTable = spectator.query('.nested-table');
      const innerTable = outerTable!.querySelector('table');
      const outerRows = Array.from<HTMLTableRowElement>(
        outerTable!.querySelector('tbody')!.rows
      );
      const innerRows = Array.from<HTMLTableRowElement>(
        innerTable!.querySelector('tbody')!.rows
      );

      expect(outerTable).toBeTruthy();
      expect(outerRows.map((row) => row.cells.length)).toEqual([3, 3, 3, 3]);

      expect(innerTable).toBeTruthy();
      expect(innerRows.map((row) => row.cells.length)).toEqual([3, 3, 3, 3]);
    });
  });

  describe('CosTable - with basic data source', () => {
    let spectator: Spectator<CosTableAppComponent>;
    let component: CosTableAppComponent;
    const createComponent = createComponentFactory({
      component: CosTableAppComponent,
      imports: [CosTableModule],
    });

    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;
    });

    it('should be able to create a table with the right content and without when row', () => {
      const tableElement = spectator.query('.cos-table')!;
      const data = component.dataSource!.data;
      expectTableToMatchContent(tableElement, [
        ['Column A', 'Column B', 'Column C'],
        [data[0].a, data[0].b, data[0].c],
        [data[1].a, data[1].b, data[1].c],
        [data[2].a, data[2].b, data[2].c],
        ['fourth_row'],
        ['Footer A', 'Footer B', 'Footer C'],
      ]);
    });
  });

  describe('CosTable - create a table with special when row', () => {
    let spectator: Spectator<CosTableWithWhenRowApp>;
    const createComponent = createComponentFactory({
      component: CosTableWithWhenRowApp,
      imports: [CosTableModule],
    });

    beforeEach(() => {
      spectator = createComponent();
    });

    it('should create a table with special when row', () => {
      const tableElement = spectator.query('.cos-table');
      expectTableToMatchContent(tableElement!, [
        ['Column A'],
        ['a_1'],
        ['a_2'],
        ['a_3'],
        ['fourth_row'],
        ['Footer A'],
      ]);
    });
  });
});
