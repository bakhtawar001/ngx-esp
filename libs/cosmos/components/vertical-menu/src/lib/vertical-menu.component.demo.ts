import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MENU_DATA_DEMO } from './vertical-menu-data.demo';

@Component({
  selector: 'cos-vertical-menu-demo-component',
  template: `
    <cos-vertical-menu [activeItem]="activeItem" [label]="label" [menu]="menu">
    </cos-vertical-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosVerticalMenuDemoComponent {
  @Input()
  label = 'Settings menu';

  @Input()
  activeItem = MENU_DATA_DEMO[0].children[0];

  @Input()
  menu;

  setActiveItem(item) {
    this.activeItem = item;
  }
}
