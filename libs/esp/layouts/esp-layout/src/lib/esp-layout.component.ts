import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractLayoutComponent } from '@cosmos/layout';

@Component({
  selector: 'esp-layout',
  templateUrl: './esp-layout.component.html',
  styleUrls: ['./esp-layout.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class EspLayoutComponent extends AbstractLayoutComponent {}
