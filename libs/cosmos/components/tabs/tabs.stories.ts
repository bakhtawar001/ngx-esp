import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import markdown from './tabs.md';

@Component({
  selector: 'cos-tabs-demo-component',
  styleUrls: [],
  template: `
    <mat-tab-group mat-align-tabs="start" animationDuration="0ms" disableRipple>
      <mat-tab label="Products">
        <ng-template matTabContent> Products Content </ng-template>
      </mat-tab>
      <mat-tab label="Catalogs">
        <ng-template matTabContent> Catalogs Content </ng-template>
      </mat-tab>
      <mat-tab label="Suppliers">
        <ng-template matTabContent> Suppliers Content </ng-template>
      </mat-tab>
      <mat-tab disabled label="Disabled">
        <ng-template matTabContent> Unreachable Content </ng-template>
      </mat-tab>
    </mat-tab-group>
  `,
})
class CosTabsDemoComponent {}

@Component({
  selector: 'cos-tab-nav-demo-component',
  styleUrls: [],
  template: `
    <nav mat-tab-nav-bar mat-align-tabs="start" disableRipple>
      <a mat-tab-link [active]="true"> Products </a>
      <a mat-tab-link> Catalogs </a>
      <a mat-tab-link> Suppliers </a>
      <a mat-tab-link disabled> Disabled </a>
    </nav>
  `,
})
class CosTabNavDemoComponent {}

export default {
  title: 'Navigation/Tabs',

  parameters: {
    notes: markdown,
  },
};

export const SingleRoute = () => ({
  moduleMetadata: {
    declarations: [CosTabsDemoComponent],
    imports: [MatTabsModule],
  },
  component: CosTabsDemoComponent,
});

export const navigation = () => ({
  moduleMetadata: {
    declarations: [CosTabNavDemoComponent],
    imports: [MatTabsModule],
  },
  component: CosTabNavDemoComponent,
});
