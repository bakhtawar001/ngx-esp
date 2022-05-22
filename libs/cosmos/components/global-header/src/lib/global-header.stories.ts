import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import markdown from './global-header.md';
import { CosGlobalHeaderModule } from './global-header.module';

export default {
  title: 'Navigation/Global Header',

  parameters: {
    notes: markdown,
  },
};

@Component({
  selector: 'cos-global-header-demo-component',
  template: `
    <cos-global-header
      ariaLabel="Main"
      bottomSheetLogoSrc="https://placekitten.com/100/25"
      [clientSafeMode]="true"
      [navItemsDesktop]="[
        {
          id: '1',
          title: 'Dashboard',
          url: '#',
          icon: 'fa fa-tachometer-alt'
        },
        {
          title: 'Collections',
          url: '#',
          icon: 'fa fa-archive'
        },
        {
          title: 'Presentations',
          url: '#',
          icon: 'fa fa-images'
        },
        {
          title: 'Orders',
          url: '#',
          icon: 'fa fa-file-invoice'
        },
        {
          title: 'Notifications',
          url: '#',
          icon: 'fa fa-bell',
          badge: {
            title: 2
          }
        },
        {
          title: 'Account',
          icon: 'fa fa-user-circle',
          type: 'collapsable',
          function: 'userMenu'
        }
      ]"
      [navItemsMobile]="[
        {
          title: 'Collections',
          url: '#',
          icon: 'fa fa-archive'
        },
        {
          title: 'Presentations',
          url: '#',
          icon: 'fa fa-images'
        },
        {
          title: 'Orders',
          url: '#',
          icon: 'fa fa-file-invoice'
        },
        {
          title: 'More',
          type: 'collapsable',
          icon: 'fa fa-bars',
          badge: {
            title: 2
          }
        }
      ]"
    >
      <a class="header-style-18" href="#">Encore Logo</a>
      <cos-global-search
        inputLabel="Search for"
        categoryLabel="Search in"
        buttonLabel="Search"
        [categories]="[
          { value: 'products', text: 'Products' },
          { value: 'suppliers', text: 'Suppliers' }
        ]"
      ></cos-global-search>
    </cos-global-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosGlobalHeaderDemoComponent {}

@NgModule({
  imports: [
    CosGlobalHeaderModule,
    MatMenuModule,
    CosSlideToggleModule,
    MatDividerModule,
    BrowserAnimationsModule,
    RouterTestingModule.withRoutes([]),
  ],
  declarations: [CosGlobalHeaderDemoComponent],
  exports: [CosGlobalHeaderDemoComponent],
})
class GlobalHeaderDemoModule {}

export const primary = () => ({
  moduleMetadata: {
    imports: [GlobalHeaderDemoModule],
  },
  component: CosGlobalHeaderDemoComponent,
});
