import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'cos-collection-section',
  templateUrl: 'collection-section.component.html',
  styleUrls: ['collection-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCollectionSectionComponent {
  @Input() name = '';
  @Output() checkboxChange = new EventEmitter<MouseEvent>();
  @Output() deleteClick = new EventEmitter<MouseEvent>();
  @Output() moveDownClick = new EventEmitter<MouseEvent>();
  @Output() moveUpClick = new EventEmitter<MouseEvent>();

  isCollapsed = false;
}
