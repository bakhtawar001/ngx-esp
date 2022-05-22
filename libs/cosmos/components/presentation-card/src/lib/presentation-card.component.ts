import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'cos-presentation-card',
  templateUrl: 'presentation-card.component.html',
  styleUrls: ['presentation-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CosPresentationCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() createdDate = '';
  @Input() lastUpdatedDate = '';
  @Input() lastUsedDate = '';
  @Input() imgUrl = '';
  @Input() imgAlt = '';
  @Input() whiteBg = false;
  @Input() size: 'small' | undefined;
  @Input() products: any[] = [];
  @Input() productCount = 0;
  @Input() showMenu = false;
  @Input() topBorderColor = '#6A7281';

  @Output() handleClick = new EventEmitter();

  clickCallback(event: MouseEvent) {
    this.handleClick.emit(event);
  }
}
