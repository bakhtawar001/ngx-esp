import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosCardModule } from '@cosmos/components/card';
import { CosTrackerModule } from '@cosmos/components/tracker';
import markdown from './card-tree.md';
import { CosCardTreeModule } from '../card-tree.module';
@Component({
  selector: 'cos-card-tree-demo-component',
  styleUrls: ['card-tree-demo.scss'],
  template: `
    <cos-card-tree>
      <cos-card-tree-parent>
        <cos-card>
          <div class="cos-tree-demo-row">
            <div>
              <h1 class="header-style-16 mb-8">Sales Order CPO 55678</h1>
              <h2 class="header-style-14-bold">City of Pawnee</h2>
            </div>
            <div>
              <p class="header-style-12-shark mb-8">Status</p>
              <p class="header-style-16 mb-4">In Fulfillment</p>
              <p cosAttributeTag>Last Updated June 9, 2020</p>
            </div>
            <div>
              <p class="header-style-12-shark mb-0">Important Dates</p>
              <ul class="cos-list-no-style pl-0 mt-4">
                <li class="mb-0">Ordered on November 12, 2020</li>
                <li class="mb-0">Expected to ship by November 12, 2020</li>
                <li class="mb-0">Needed in hand by November 12, 2020</li>
              </ul>
            </div>
          </div>
        </cos-card>
      </cos-card-tree-parent>
      <cos-card-tree-child>
        <cos-card>
          <div class="cos-tree-demo-row">
            <div>
              <h1 class="header-style-16 mb-8">PO # 1001</h1>
              <h2 class="header-style-14-bold mb-0">Axe Me About T-Shirts</h2>
              <p class="body-style-11 mb-8">asi/87294</p>
              <p>(888) 347-4622</p>
            </div>
            <div>
              <div class="cos-tree-child-with-tracker">
                <div>
                  <p class="header-style-12-shark mb-8">Status</p>
                  <p class="header-style-16 mb-4">In Fulfillment</p>
                  <p cosAttributeTag>Last Updated June 9, 2020</p>
                </div>
                <div>
                  <p class="header-style-12-shark mb-0">Important Dates</p>
                  <ul class="cos-list-no-style pl-0 mt-4">
                    <li class="mb-0">Ordered on November 12, 2020</li>
                    <li class="mb-0">Expected to ship by November 12, 2020</li>
                    <li class="mb-0">Needed in hand by November 12, 2020</li>
                  </ul>
                </div>
              </div>
              <div class="cos-tree-child-tracker-container">
                <cos-tracker [startsOnZero]="startOnZeroStep" currentStep="4">
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>4</span></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>5</span></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>6</span></cos-tracker-step>
                </cos-tracker>
              </div>
            </div>
          </div>
        </cos-card>
      </cos-card-tree-child>
      <cos-card-tree-child>
        <cos-card>
          <div class="cos-tree-demo-row">
            <div>
              <h1 class="header-style-16 mb-8">PO # 1001</h1>
              <h2 class="header-style-14-bold mb-0">Axe Me About T-Shirts</h2>
              <p class="body-style-11 mb-8">asi/87294</p>
              <p>(888) 347-4622</p>
            </div>
            <div>
              <div class="cos-tree-child-with-tracker">
                <div>
                  <p class="header-style-12-shark mb-8">Status</p>
                  <p class="header-style-16 mb-4">In Fulfillment</p>
                  <p cosAttributeTag>Last Updated June 9, 2020</p>
                </div>
                <div>
                  <p class="header-style-12-shark mb-0">Important Dates</p>
                  <ul class="cos-list-no-style pl-0 mt-4">
                    <li class="mb-0">Ordered on November 12, 2020</li>
                    <li class="mb-0">Expected to ship by November 12, 2020</li>
                    <li class="mb-0">Needed in hand by November 12, 2020</li>
                  </ul>
                </div>
              </div>
              <div class="cos-tree-child-tracker-container">
                <cos-tracker [startsOnZero]="startOnZeroStep" currentStep="4">
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>4</span></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>5</span></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>6</span></cos-tracker-step>
                </cos-tracker>
              </div>
            </div>
          </div>
        </cos-card>
      </cos-card-tree-child>
      <cos-card-tree-child>
        <cos-card>
          <div class="cos-tree-demo-row">
            <div>
              <h1 class="header-style-16 mb-8">PO # 1001</h1>
              <h2 class="header-style-14-bold mb-0">Axe Me About T-Shirts</h2>
              <p class="body-style-11 mb-8">asi/87294</p>
              <p>(888) 347-4622</p>
            </div>
            <div>
              <div class="cos-tree-child-with-tracker">
                <div>
                  <p class="header-style-12-shark mb-8">Status</p>
                  <p class="header-style-16 mb-4">In Fulfillment</p>
                  <p cosAttributeTag>Last Updated June 9, 2020</p>
                </div>
                <div>
                  <p class="header-style-12-shark mb-0">Important Dates</p>
                  <ul class="cos-list-no-style pl-0 mt-4">
                    <li class="mb-0">Ordered on November 12, 2020</li>
                    <li class="mb-0">Expected to ship by November 12, 2020</li>
                    <li class="mb-0">Needed in hand by November 12, 2020</li>
                  </ul>
                </div>
              </div>
              <div class="cos-tree-child-tracker-container">
                <cos-tracker [startsOnZero]="startOnZeroStep" currentStep="4">
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"
                    ><i class="fa fa-check cos-text--white"></i
                  ></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>4</span></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>5</span></cos-tracker-step>
                  <cos-tracker-step size="lg"><span>6</span></cos-tracker-step>
                </cos-tracker>
              </div>
            </div>
          </div>
        </cos-card>
      </cos-card-tree-child>
    </cos-card-tree>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosCardTreeDemoComponent {}

export default {
  title: 'Composites/Card Tree',
  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [CosCardTreeDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosCardTreeModule,
      CosCardModule,
      CosTrackerModule,
      CosAttributeTagModule,
    ],
  },
  component: CosCardTreeDemoComponent,
  props: {},
});
