import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Party } from '@esp/models';

@Component({
  selector: 'cos-customer-dropdown',
  templateUrl: 'customer-dropdown.component.html',
  styleUrls: ['customer-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-customer-dropdown',
  },
  encapsulation: ViewEncapsulation.None,
})
export class CosCustomerDropdownComponent implements OnInit {
  private _observer: MutationObserver | null = null;
  public selectedCustomer?: Party;
  @ViewChild('dropdownList', { static: true })
  dropdownList!: ElementRef<HTMLElement>;
  @Input() dropdownLabel!: string;
  @Input() newCustomerButtonLabel!: string;
  @Input() customers: Array<Party> = [];
  @Input() selectedCustomerId: number | null = null;

  getNoImageUrl(customerId: number | null) {
    if (!customerId)
      return 'https://esp.uat-asicentral.com/images/no_contact.png';
    return this.customers.find((x) => x.Id === customerId)?.IsCompany
      ? 'https://esp.uat-asicentral.com/images/no_company.png'
      : 'https://esp.uat-asicentral.com/images/no_contact.png';
  }

  getImageUrl(customerId: number | null) {
    if (!customerId) return this.getNoImageUrl(customerId);

    const profileImageUrl = this.customers.find(
      (x) => x.Id === customerId
    )?.ProfileImageUrl;

    return profileImageUrl ? profileImageUrl : this.getNoImageUrl(customerId);
  }

  ngOnInit() {
    this.setSelectedCustomer();
  }

  onChange() {
    this.setSelectedCustomer();
  }

  onChangeNative($event: Event) {
    this.selectedCustomerId = Number(
      ($event.target as HTMLSelectElement).value
    );
    this.setSelectedCustomer();
  }

  setSelectedCustomer() {
    this.selectedCustomer = this.customers.find(
      (x) => x['Id'] === this.selectedCustomerId
    );
  }

  onToggle($event: boolean) {
    if ($event === true) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  onOpen() {
    const listElement = this.dropdownList.nativeElement;
    this._observer = new MutationObserver((records) => {
      const activeOptions = records.filter(
        (record) =>
          record.target instanceof HTMLElement &&
          record.target.classList.contains('mat-active')
      );

      if (activeOptions.length === 1) {
        (activeOptions[0].target as HTMLElement).scrollIntoView();
      }
    });
    this._observer.observe(listElement, {
      attributes: true,
      subtree: true,
    });
  }

  onClose() {
    this._observer!.disconnect();
  }
}
