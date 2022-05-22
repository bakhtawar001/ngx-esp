import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosPillModule } from '@cosmos/components/pill';

import markdown from './action-bar.md';
import { CosActionBarModule } from './action-bar.module';

@Component({
  selector: 'cos-action-bar-demo-component',
  styleUrls: [
    './action-bar-demo.scss',
    '../../../pill/src/lib/pill.directive.scss',
  ],
  template: `
    <div class="action-bar-example">
      <cos-action-bar>
        <div class="card-actions">
          <cos-checkbox
            class="checkbox-products"
            id="checkbox-products"
            name="checkbox-products"
          >
            <span cosPill>1</span> Product Selected
          </cos-checkbox>

          <cos-action-bar-controls>
            {{ showMenu }}
            <button cos-stroked-button color="warn" (click)="testClick()">
              Remove from collection
            </button>

            <button cos-stroked-button color="primary" (click)="testClick()">
              <i class="fa fa-copy mr-8"></i>
              Copy to new collection
            </button>

            <button cos-flat-button color="primary" (click)="testClick()">
              <i class="fa fa-archive mr-8"></i> Use in presentation
            </button>
          </cos-action-bar-controls>
        </div>
      </cos-action-bar>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosActionBarDemoComponent {
  @Input() style;
  @Input() size;
  @Input() innerText: string;

  testClick() {
    console.log('test');
  }
}

export default {
  title: 'Composites/Contextual Action Bar',
  parameters: {
    notes: markdown,
  },
};

export const primary = (props) => ({
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      CosActionBarModule,
      CosButtonModule,
      CosCheckboxModule,
      CosPillModule,
    ],
    declarations: [CosActionBarDemoComponent],
  },
  component: CosActionBarDemoComponent,
  props,
});
