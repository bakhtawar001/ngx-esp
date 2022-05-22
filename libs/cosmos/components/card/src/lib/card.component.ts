import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-card-controls',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'cos-card-controls',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCardControlsComponent {}

@Component({
  selector: 'cos-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-card',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCardComponent {
  @Input() borderColor = 'initial';

  @Input() inlineControls = false;

  @HostBinding('style.border-top')
  get border() {
    return this.borderColor ? `5px solid ${this.borderColor}` : '';
  }
}
