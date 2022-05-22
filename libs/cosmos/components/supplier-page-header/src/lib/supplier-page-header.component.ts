import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SupplierDocumentation } from '@smartlink/suppliers';

@Component({
  selector: 'cos-supplier-page-header',
  templateUrl: 'supplier-page-header.component.html',
  styleUrls: ['supplier-page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSupplierPageHeaderComponent {
  imgError = false;
  private _expandedAll = false;
  private _expandedDetails = false;
  private _expandedContacts = false;

  @HostBinding('class.cos-supplier-page-header') mainClass = true;

  @Input()
  supplier: any;

  @Input()
  labels: any;

  get expandedAll() {
    return this._expandedAll;
  }

  get expandedDetails() {
    return this._expandedDetails;
  }

  get expandedContacts() {
    return this._expandedContacts;
  }

  get yearsInIndustry() {
    return new Date().getFullYear() - this.supplier['YearInIndustry'] || 0;
  }

  // @TODO: strict mode (type any)
  get fobPoints() {
    return this.supplier['ShippingPoints']
      ? this.supplier['ShippingPoints']
          .filter((x: any) => x.IsFOB)
          .map((x: any) => `${x.City}, ${x.State} ${x.Zip} ${x.Country}`)
      : [];
  }

  get safetyComplianceDocuments() {
    return this.documentationsFilter('MEDI');
  }

  get safetyWebpages() {
    return this.documentationsFilter('LINK');
  }

  get lineNameSearchResults() {
    return this.supplier.LineNames.map((item: string) => {
      const filters = encodeURIComponent(JSON.stringify({ linename: [item] }));
      return {
        label: item,
        url: `/products?filters=${filters}`,
      };
    });
  }

  toggleExpandedDetails() {
    this._expandedDetails = !this._expandedDetails;
  }

  toggleExpandedContacts() {
    this._expandedContacts = !this._expandedContacts;
  }

  toggleExpandedAll() {
    this._expandedAll = !this._expandedAll;
    this._expandedDetails = !this._expandedDetails;
    this._expandedContacts = !this._expandedContacts;
  }

  documentationsFilter(type: string) {
    return this.supplier.Documentations
      ? this.supplier.Documentations?.filter(
          (x: SupplierDocumentation) => x.Type === type
        )
      : [];
  }

  errorHandler(event: any) {
    this.imgError = true;
  }
}
