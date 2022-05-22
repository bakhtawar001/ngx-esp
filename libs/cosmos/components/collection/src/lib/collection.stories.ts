import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollectionSearchMockDb } from '@esp/collections/mocks';
import markdown from './collection.md';
import { CosCollectionModule } from './collection.module';

export default {
  title: 'Objects/Collection Card',
  parameters: {
    notes: markdown,
  },
};

@Component({
  selector: 'cos-collection-demo-component',
  template: `
    <cos-collection
      [collection]="collection"
      [showMenu]="showMenu"
      (handleClick)="clickTest()"
    >
      <ul class="cos-list-no-style px-16 my-0" *ngIf="size !== 'small'">
        <li class="mb-8">
          <a class="cos-text--black" href="#"><i class="fa fa-pen"></i> Edit</a>
        </li>
        <li>
          <a class="cos-text--red" href="#">
            <i class="fa fa-trash"></i> Delete</a
          >
        </li>
      </ul>
    </cos-collection>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosCollectionDemoComponent implements OnInit {
  collection = CollectionSearchMockDb.Collection;

  ngOnInit() {
    console.log(
      'CollectionSearchMockDb.Collection',
      CollectionSearchMockDb.Collection
    );
  }

  clickTest() {
    console.log('test');
  }
}

@Component({
  selector: 'cos-collection-demo-component',
  template: `
    <cos-collection [collection]="collection" [size]="size"></cos-collection>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosCollectionDemoSmallComponent extends CosCollectionDemoComponent {
  size = 'small';
}

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosCollectionDemoComponent],
    imports: [BrowserAnimationsModule, CosCollectionModule],
  },
  component: CosCollectionDemoComponent,
  props,
});

export const small = (props) => ({
  moduleMetadata: {
    declarations: [CosCollectionDemoSmallComponent],
    imports: [BrowserAnimationsModule, CosCollectionModule],
  },
  component: CosCollectionDemoSmallComponent,
});
