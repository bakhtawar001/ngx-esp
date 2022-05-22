import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-card-tree-parent',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-card-tree-parent',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCardTreeParentComponent {}

@Component({
  selector: 'cos-card-tree-child',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-card-tree-child',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCardTreeChildComponent {}

@Component({
  selector: 'cos-card-tree',
  templateUrl: 'card-tree.component.html',
  styleUrls: ['card-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-card-tree',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCardTreeComponent {}
