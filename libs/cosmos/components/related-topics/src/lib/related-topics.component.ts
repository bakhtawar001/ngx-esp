import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-related-topics',
  templateUrl: 'related-topics.component.html',
  styleUrls: [
    'related-topics.component.scss',
    '../../../pill/src/lib/pill.directive.scss',
  ],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosRelatedTopicsComponent {
  showAll = false;
  _topics: any[] = [];

  @Input()
  set topics(topics) {
    this._topics = topics;
  }
  get topics() {
    return this.showAll
      ? this._topics
      : this._topics.slice(0, this.visibleTopics);
  }

  @Input() visibleTopics = 12;

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  get showToggleButton() {
    return this._topics.length > this.visibleTopics;
  }
}
