import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-table-demo-component',
  template: `
    <ng-container *ngIf="mode === 'directive'">
      <div style="max-width: 1024px; width: 100%;">
        <table
          style="min-width:400px"
          cos-table
          [dataSource]="dataSource"
          [showStripes]="showStripes"
        >
          <!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

          <!-- Name Column -->
          <ng-container cosColumnDef="quantity">
            <th cosHeaderCell *cosHeaderCellDef>Quantity</th>
            <td cosCell *cosCellDef="let element">{{ element.quantity }}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container cosColumnDef="catalogPrice">
            <th cosHeaderCell *cosHeaderCellDef>Catalog Price</th>
            <td cosCell *cosCellDef="let element">
              {{ element.catalogPrice }}
            </td>
          </ng-container>

          <!-- Weight Column -->
          <ng-container cosColumnDef="netCost">
            <th cosHeaderCell *cosHeaderCellDef>Net Cost</th>
            <td cosCell *cosCellDef="let element">{{ element.netCost }}</td>
          </ng-container>

          <!-- Symbol Column -->
          <ng-container cosColumnDef="eqp">
            <th cosHeaderCell *cosHeaderCellDef>
              EQP
              <i class="fa fa-info-circle"></i>
            </th>
            <td cosCell *cosCellDef="let element">
              <span class="cos-text--blue">{{ element.eqp }}</span>
            </td>
          </ng-container>

          <!-- Symbol Column -->
          <ng-container cosColumnDef="profit">
            <th cosHeaderCell *cosHeaderCellDef>Profit</th>
            <td cosCell *cosCellDef="let element">{{ element.profit }}</td>
          </ng-container>

          <tr cos-header-row *cosHeaderRowDef="displayedColumns"></tr>
          <tr cos-row *cosRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </ng-container>

    <ng-container *ngIf="mode === 'component'">
      <div style="max-width: 1024px; width: 100%;">
        <cos-table
          style="min-width:400px; display:table;"
          [dataSource]="dataSource"
          [showStripes]="showStripes"
        >
          <ng-container cosColumnDef="quantity">
            <cos-header-cell *cosHeaderCellDef> Quantity </cos-header-cell>
            <cos-cell *cosCellDef="let element">
              {{ element.quantity }}
            </cos-cell>
          </ng-container>

          <ng-container cosColumnDef="catalogPrice">
            <cos-header-cell *cosHeaderCellDef> Catalog Price </cos-header-cell>
            <cos-cell *cosCellDef="let element">
              {{ element.catalogPrice }}
            </cos-cell>
          </ng-container>

          <ng-container cosColumnDef="netCost">
            <cos-header-cell *cosHeaderCellDef> Net Cost </cos-header-cell>
            <cos-cell *cosCellDef="let element">
              {{ element.netCost }}
            </cos-cell>
          </ng-container>

          <ng-container cosColumnDef="eqp">
            <cos-header-cell *cosHeaderCellDef>
              EQP <i class="fa fa-info-circle"></i>
            </cos-header-cell>
            <cos-cell *cosCellDef="let element">
              <span class="cos-text--blue">{{ element.eqp }}</span>
            </cos-cell>
          </ng-container>

          <ng-container cosColumnDef="profit">
            <cos-header-cell *cosHeaderCellDef> Profit </cos-header-cell>
            <cos-cell *cosCellDef="let element">
              {{ element.profit }}
            </cos-cell>
          </ng-container>

          <cos-header-row *cosHeaderRowDef="displayedColumns"></cos-header-row>
          <cos-row *cosRowDef="let row; columns: displayedColumns"></cos-row>
        </cos-table>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosTableDemoComponent {
  /** Storybook use only  */
  @Input() mode: 'component' | 'directive' = 'directive';

  @Input() displayedColumns: string[] = [];
  @Input() dataSource!: DataSource<unknown>;

  @Input() showStripes = false;
  // displayedColumns: string[] = [
  //   'quantity',
  //   'catalogPrice',
  //   'netCost',
  //   'eqp',
  //   'profit',
  // ];
  // dataSource = ELEMENT_DEMO_DATA;
}
