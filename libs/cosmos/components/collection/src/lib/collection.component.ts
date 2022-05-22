import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { InitialsPipe } from '@cosmos/common';
import { Avatar } from '@cosmos/components/avatar-list';
import type { CollectionSearch } from '@esp/collections';

@Component({
  selector: 'cos-collection',
  templateUrl: 'collection.component.html',
  styleUrls: ['collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class CosCollectionComponent implements OnChanges {
  private initials = new InitialsPipe();

  @Input() collection!: CollectionSearch;
  @Input() size!: string;
  @Input() showMenu = false;

  @Output() handleClick = new EventEmitter();

  public collaborators: Avatar[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.collection?.currentValue !== changes.collection?.previousValue
    ) {
      this.collaborators = this.getCollaborators();
    }
  }

  @HostBinding('class')
  get classList() {
    const classNames = ['cos-collection'];

    if (this.size) {
      classNames.push(`cos-collection--${this.size}`);
    }

    return classNames.join(' ');
  }

  private getCollaborators(): Avatar[] {
    return (
      this.collection.Collaborators?.map((collaborator) => ({
        imgUrl: collaborator.ImageUrl,
        displayText: this.initials.transform(collaborator.Name!),
        toolTipText: collaborator.Name,
      })) || []
    );
  }
}
