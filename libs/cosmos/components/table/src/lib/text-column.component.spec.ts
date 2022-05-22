import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { expectTableToMatchContent } from './table.component.spec';
import { CosTableModule } from './table.module';

interface TestData {
  propertyA: string;
  propertyB: string;
  propertyC: string;
}

// eslint-disable-next-line @angular-eslint/use-component-selector
@Component({
  template: `
    <cos-table [dataSource]="data">
      <cos-text-column name="propertyA"></cos-text-column>
      <cos-text-column name="propertyB"></cos-text-column>
      <cos-text-column name="propertyC"></cos-text-column>
      <cos-header-row *cosHeaderRowDef="displayedColumns"></cos-header-row>
      <cos-row *cosRowDef="let row; columns: displayedColumns"></cos-row>
    </cos-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class BasicTextColumnApp {
  displayedColumns = ['propertyA', 'propertyB', 'propertyC'];

  data: TestData[] = [
    { propertyA: 'a_1', propertyB: 'b_1', propertyC: 'c_1' },
    { propertyA: 'a_2', propertyB: 'b_2', propertyC: 'c_2' },
  ];
}

describe('CosTextColumn', () => {
  let tableElement: HTMLElement;
  let component: BasicTextColumnApp;
  let spectator: Spectator<BasicTextColumnApp>;
  const createComponent = createComponentFactory({
    component: BasicTextColumnApp,
    imports: [CosTableModule],
    declarations: [BasicTextColumnApp],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    tableElement = spectator.query('.cos-table')!;
  });

  it('should be able to render the basic columns', () => {
    expectTableToMatchContent(tableElement, [
      ['PropertyA', 'PropertyB', 'PropertyC'],
      ['a_1', 'b_1', 'c_1'],
      ['a_2', 'b_2', 'c_2'],
    ]);
  });
});
