import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-presentation-header',
  templateUrl: 'presentation-header.component.html',
  styleUrls: ['presentation-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-presentation-header',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosPresentationHeaderComponent {
  @Input() showDetails = false;
  // @TODO: add valid type
  @Input() presentation: any;

  @HostBinding('style.border-color')
  get classList() {
    return this.presentation.clientColor;
  }
}
