import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractLayoutComponent } from '@cosmos/layout';

@Component({
  selector: 'esp-encore-layout',
  templateUrl: './encore-layout.component.html',
  styleUrls: ['./encore-layout.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class EncoreLayoutComponent extends AbstractLayoutComponent {}
