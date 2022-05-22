import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-card-menu',
  templateUrl: 'card-menu.component.html',
  styleUrls: ['card-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-card-menu',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosCardMenuComponent {
  expanded = false;
  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
