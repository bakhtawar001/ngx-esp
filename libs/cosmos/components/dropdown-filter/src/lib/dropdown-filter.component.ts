import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CosCheckboxChange } from '@cosmos/components/checkbox';
import { UniqueIdService } from '@cosmos/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'cos-dropdown-filter',
  templateUrl: 'dropdown-filter.component.html',
  styleUrls: ['dropdown-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-dropdown-filter',
  },
})
export class CosDropdownFilterComponent {
  isDesktop = false;
  searchString = '';
  showAllCheckboxes = true;
  checkboxLimit = 10;
  @Input() id = `${this._uniqueIdService.getUniqueIdForDom(
    'cos-dropdown-filter'
  )}`;
  @Input() data: any;
  @Input() labelText = '';
  @Input() placeholderText = '';

  @Output()
  readonly checkboxStateChange: EventEmitter<any> = new EventEmitter();

  constructor(
    breakpointObserver: BreakpointObserver,
    private _uniqueIdService: UniqueIdService
  ) {
    breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.isDesktop = result.matches;
        this.showAllCheckboxes = this.isDesktop;
      });
  }

  get selectedItems() {
    return this.data;
  }

  get filteredItems() {
    return this.searchString.length > 0
      ? this.selectedItems.filter((x: any) =>
          x.Name.toLowerCase().includes(this.searchString.toLowerCase())
        )
      : this.selectedItems;
  }

  get showAllCheckboxesText() {
    return this.showAllCheckboxes ? 'Show less' : 'Show more';
  }

  toggleShowAllCheckboxes(): void {
    this.showAllCheckboxes = !this.showAllCheckboxes;
  }

  checkboxChange(id: CosCheckboxChange) {
    this.data.map((item: any) => {
      if (item.Id === id) {
        item.checked = !item.checked;
        this.checkboxStateChange.emit(item);
      }
    });
  }
}
