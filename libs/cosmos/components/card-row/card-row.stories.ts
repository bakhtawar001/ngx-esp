import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, ViewEncapsulation } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosCardModule } from '@cosmos/components/card';

@Component({
  selector: 'cos-card-row-demo-component',
  styleUrls: ['./card-row-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul class="card-row">
      <li>
        <cos-card class="supplier-row">
          <div class="supplier-info">
            <p class="header-style-18">Bags and Totes</p>
            <p class="inline-avatar">
              Created 5/14/20 by
              <cos-avatar size="small"
                ><img src="https://via.placeholder.com/64" alt=""
              /></cos-avatar>
              Raymond Borque
            </p>
            <p>Last updated 7/21/2020</p>
            <p>12 suppliers</p>
          </div>

          <ng-container *ngTemplateOutlet="cardMenu"></ng-container>
          <cos-card-menu>
            <ng-container *ngTemplateOutlet="cardMenu"></ng-container>
          </cos-card-menu>
          <!-- <div class="supplier-actions cos-card-menu">
            <div class="supplier-buttons">
              <button cos-icon-button>
                <i class="fa fa-pencil-alt"></i>
              </button>
              <button cos-icon-button>
                <i class="fa fa-share"></i>
              </button>
              <button cos-icon-button>
                <i class="fa fa-copy"></i>
              </button>
              <button cos-icon-button color="warn">
                <i class="fa fa-trash-alt"></i>
              </button>
            </div>
            <div class="supplier-menu">
              <button cos-icon-button>
                <i class="fa fa-ellipsis-h"></i>
                <span class="cos-accessibly-hidden">Menu</span>
              </button>
            </div>
          </div> -->
        </cos-card>
      </li>
    </ul>
    <ng-template #cardMenu>
      <ul class="supplier-buttons cos-list-no-style px-16 my-0">
        <li>
          <button cos-button>
            <i class="fa fa-pencil-alt"></i>
            <span class="ml-8">Edit</span>
          </button>
        </li>
        <li>
          <button cos-button>
            <i class="fa fa-share"></i>
            <span class="ml-8">Share</span>
          </button>
        </li>
        <li>
          <button cos-button>
            <i class="fa fa-copy"></i>
            <span class="ml-8">Copy</span>
          </button>
        </li>
        <li>
          <button cos-button color="warn">
            <i class="fa fa-trash-alt"></i>
            <span class="ml-8">Delete</span>
          </button>
        </li>
      </ul>
    </ng-template>
  `,
})
class CosCardRowExampleComponent {}

@Component({
  selector: 'cos-card-row-draggable-demo-component',
  styleUrls: ['./card-row-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul
      class="card-row drag-boundary"
      cdkDropList
      cdkDropListOrientation="horizontal"
      (cdkDropListDropped)="drop($event)"
    >
      <li
        cdkDrag
        cdkDragBoundary=".drag-boundary"
        *ngFor="let item of list; let i = index"
      >
        <cos-card class="preferred-supplier-row">
          <div class="supplier-row-control">
            <p class="supplier-row-index">{{ i + 1 }}</p>
            <i class="supplier-row-handle fa fa-grip-lines" cdkDragHandle></i>
            <cos-checkbox labelHidden="true"></cos-checkbox>
          </div>
          <div class="supplier-row-info">
            <p class="header-style-16 supplier-row-title">
              <a href="#">{{ item.name }}</a>
              <span class="body-style-11 asi-number">{{ item.asiNumber }}</span>
            </p>
            <p *ngIf="item.note">{{ item.note }}</p>

            <img class="supplier-image" [src]="item.logo" alt="" />
          </div>
          <div class="supplier-row-actions">
            <button class="supplier-row-button" cos-flat-button>
              Edit preferred pricing
            </button>
            <div class="supplier-row-menu">
              <button cos-icon-button>
                <i class="fa fa-ellipsis-h"></i>
                <span class="cos-accessibly-hidden">Menu</span>
              </button>
            </div>
          </div>
        </cos-card>
      </li>
    </ul>
  `,
})
class CosCardRowDraggableExampleComponent {
  list = [
    {
      logo: 'http://placehold.it/84x48',
      name: 'Totes Magotes',
      asiNumber: 'asi/57956',
      note: 'Minus Fixed Percent',
    },
    {
      logo: 'http://placehold.it/84x48',
      name: 'Franmara Inc',
      asiNumber: 'asi/55450',
      note: '',
    },
    {
      logo: 'http://placehold.it/84x48',
      name: 'Snugz USA',
      asiNumber: 'asi/88060',
      note: 'Minus Fixed Percent (w/ exceptions)',
    },
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }
}

export default {
  title: 'Layout Examples/Card Row',
  parameters: {},
};

export const supplierCardRow = () => ({
  moduleMetadata: {
    declarations: [CosCardRowExampleComponent],
    imports: [
      CosCardModule,
      CosAvatarModule,
      CosButtonModule,
      BrowserAnimationsModule,
    ],
  },
  component: CosCardRowExampleComponent,
  props: {},
});

export const preferredSupplierCardRow = () => ({
  moduleMetadata: {
    declarations: [CosCardRowDraggableExampleComponent],
    imports: [
      BrowserAnimationsModule,
      CosCardModule,
      CosAvatarModule,
      CosButtonModule,
      CosCheckboxModule,
      DragDropModule,
    ],
  },
  component: CosCardRowDraggableExampleComponent,
  props: {},
});
