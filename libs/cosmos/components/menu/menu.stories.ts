import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import markdown from './menu.md';

@Component({
  selector: 'cos-menu-demo-component',
  styleUrls: ['./menu-demo.scss'],
  template: `
    <div style="padding-top:100px;">
      <button
        cos-button
        [matMenuTriggerFor]="megamenu"
        (menuOpened)="toggleText()"
        (menuClosed)="toggleText()"
      >
        {{ !expanded ? 'Show More' : 'Show Less' }}
      </button>
      <mat-menu
        #megamenu="matMenu"
        class="cos-menu--full-width"
        backdropClass="cos-backdrop--full-width"
        [yPosition]="menuYPosition"
      >
        <div class="cos-filters-mega-menu" (click)="$event.stopPropagation()">
          <div class="cos-form-row">
            <label class="cos-form-label" for="sizeInput"> Size </label>
            <input
              cos-input
              [attr.id]="id"
              id="sizeInput"
              placeholder="Enter a value"
            />
          </div>
          <div class="cos-form-row">
            <label class="cos-form-label" for="materialInput"> Material </label>
            <input
              cos-input
              [attr.id]="id"
              id="materialInput"
              placeholder="Enter a value"
            />
          </div>
          <div class="cos-form-row">
            <label class="cos-form-label" for="imprintSelect"> Imprint </label>
            <select matNativeControl attr.id="imprintSelect">
              <option value="">Imprint Method</option>
              <option value="1">Apples</option>
              <option value="2">Bananas</option>
              <option value="3">Grapes</option>
              <option value="4">Oranges</option>
            </select>
          </div>
          <div class="cos-form-row">
            <span class="cos-form-label"> Other Stuff </span>
            <div class="cos-mega-menu-demo-radios">
              <ng-template ngFor let-item [ngForOf]="checkboxes" let-i="index">
                <cos-checkbox id="checkbox-{{ i }}" name="checkbox-{{ i }}">
                  {{ checkboxes[i] }}
                </cos-checkbox>
              </ng-template>
            </div>
          </div>
          <div class="cos-form-row">
            <span class="cos-form-label">Market</span>
            <div
              class="cos-mega-menu-demo-radios cos-mega-menu-demo-radios--market"
            >
              <cos-checkbox id="checkbox-us" name="checkbox-us">
                US Market
              </cos-checkbox>
              <cos-checkbox id="checkbox-ca" name="checkbox-ca">
                Canadian Market
              </cos-checkbox>
            </div>
          </div>
          <div class="cos-mega-menu-demo-controls">
            <button
              cos-stroked-button
              color="primary"
              disabled="true"
              size="sm"
            >
              Reset
            </button>
            <button cos-flat-button color="primary" size="sm">Apply</button>
          </div>
        </div>
      </mat-menu>
    </div>
  `,
})
class CosMenuDemoComponent {
  expanded = false;

  @Input() menuYPosition: string;

  checkboxes = [
    'Live Product Feed',
    'Specials',
    'With Virutal Samples',
    'With Rush Service',
    'Use Pricing',
    'Live Inventory',
    'With Prices',
    'Made in the USA',
    'Full-Color Process',
    'Canadian Pricing (CAD)',
    'E-commm Connected',
    'With Images',
    'Union Affiliated',
    'Personalized',
    'Prop 65 Warnings',
    'New Products',
    'With Videos',
    'Minority Owned',
    'Sold Unimprinted',
    'No Hazardous Materials',
    'No Choking Hazard',
  ];

  toggleText() {
    this.expanded = !this.expanded;
  }
}

@Component({
  selector: 'cos-menu-demo-component',
  styleUrls: ['./menu-demo.scss'],
  template: `
    <div class="cos-pointer-menu-demo-component">
      <button
        cos-button
        [matMenuTriggerFor]="menu"
        (menuOpened)="toggleText()"
        (menuClosed)="toggleText()"
      >
        {{ !expanded ? 'Show More' : 'Show Less' }}
      </button>
      <mat-menu
        #menu="matMenu"
        class="cos-global-menu-panel"
        backdropClass="cos-global-menu-backdrop"
        yPosition="below"
      >
        <a href="#" mat-menu-item class="cos-menu-item">
          <i class="fa fa-user"></i>
          <span>Manage my account</span>
        </a>
        <a href="#" mat-menu-item class="cos-menu-item">
          <i class="fa fa-cog"></i>
          <span>Preferences</span>
        </a>
        <mat-divider></mat-divider>
        <a href="#" mat-menu-item class="cos-menu-item">
          <i class="fa fa-align-left"></i>
          <span>Suppliers and Notes</span>
        </a>
        <a href="#" mat-menu-item class="cos-menu-item">
          <i class="fa fa-newspaper"></i>
          <span>ESP updates</span>
        </a>
        <mat-divider></mat-divider>
        <button
          mat-menu-item
          class="cos-menu-item"
          (click)="toggleClientSafeMode()"
        >
          <cos-toggle
            cos-menu-item
            id="client-safe-toggle"
            name="client-safe-toggle"
            size="small"
            [checked]="clientSafeMode"
            >Client Safe Mode</cos-toggle
          >
        </button>
        <a href="#" mat-menu-item class="cos-menu-item cos-menu-item--unique">
          <i class="fa fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </mat-menu>
    </div>
  `,
})
class CosPointerMenuDemoComponent {
  expanded = false;
  clientSafeMode = true;

  toggleText() {
    this.expanded = !this.expanded;
  }

  toggleClientSafeMode() {
    this.clientSafeMode = !this.clientSafeMode;
  }
}

export default {
  title: 'Overlays/Menu',
  parameters: {
    notes: markdown,
  },
  args: {
    menuYPosition: 'below',
  },
  argTypes: {
    menuYPosition: {
      name: 'Menu Y Position',
      options: ['above', 'below'],
      control: { type: 'select' },
    },
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosMenuDemoComponent],
    imports: [
      BrowserAnimationsModule,
      MatMenuModule,
      CosButtonModule,
      CosCheckboxModule,
      CosInputModule,
    ],
  },
  component: CosMenuDemoComponent,
  props,
});

export const withPointer = () => ({
  moduleMetadata: {
    declarations: [CosPointerMenuDemoComponent],
    imports: [
      BrowserAnimationsModule,
      MatMenuModule,
      MatDividerModule,
      CosButtonModule,
      CosSlideToggleModule,
    ],
  },
  component: CosPointerMenuDemoComponent,
});
