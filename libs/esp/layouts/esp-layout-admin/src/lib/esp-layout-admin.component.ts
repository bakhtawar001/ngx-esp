import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractLayoutComponent } from '@cosmos/layout';

@Component({
  selector: 'esp-layout-admin',
  templateUrl: './esp-layout-admin.component.html',
  // styleUrls: ['./esp-layout-admin.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class EspLayoutAdminComponent extends AbstractLayoutComponent {
  sideBarMouseEnter() {
    this.document.body.classList.add('sidebar-hover');
  }

  sideBarMouseLeave() {
    this.document.body.classList.remove('sidebar-hover');
  }
}
