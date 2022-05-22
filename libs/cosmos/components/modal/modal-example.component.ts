import { Component } from '@angular/core';

@Component({
  selector: 'cos-modal-example',
  templateUrl: 'modal-example.component.html',
})
export class CosModalExampleComponent {
  ELEMENT_DATA: any[] = [
    {
      quantity: 250,
      catalogPrice: '$0.75',
      netCost: '$0.40',
      eqp: '$0.22',
      profit: '$0.32',
    },
    {
      quantity: 500,
      catalogPrice: '$0.75',
      netCost: '$0.40',
      eqp: '$0.22',
      profit: '$0.32',
    },
    {
      quantity: 750,
      catalogPrice: '$0.75',
      netCost: '$0.40',
      eqp: '$0.22',
      profit: '$0.32',
    },
    {
      quantity: 1000,
      catalogPrice: '$0.75',
      netCost: '$0.40',
      eqp: '$0.22',
      profit: '$0.32',
    },
  ];

  displayedColumns: string[] = [
    'quantity',
    'catalogPrice',
    'netCost',
    'eqp',
    'profit',
  ];
  dataSource = this.ELEMENT_DATA;
}
