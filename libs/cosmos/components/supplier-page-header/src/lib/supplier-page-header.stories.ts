import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosSupplierPageHeaderComponent } from './supplier-page-header.component';
import data from './supplier-page-header.data.json';
import markdown from './supplier-page-header.md';
import { CosSupplierPageHeaderModule } from './supplier-page-header.module';

export default {
  title: 'Layout Examples/Supplier Page Header',

  parameters: {
    notes: markdown,
  },
};

export const primary = () => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, CosSupplierPageHeaderModule],
    provider: [],
  },
  component: CosSupplierPageHeaderComponent,
  props: {
    supplier: data,
    labels: {
      addTo: 'Add to',
      artwork: 'Artwork',
      awards: 'Awards',
      contacts: 'Company Contacts',
      contactInfo: 'Contact Information',
      details: 'Supplier Details',
      email: 'Send a message',
      headquarters: 'Headquarters',
      orders: 'Orders',
      preferredSupplier: 'Preferred Supplier Group',
      preferredPricing: 'Preferred Pricing',
      references: 'Independent Distributor References',
      tollFree: 'Toll Free',
      viewMore: 'View more information',
      viewLess: 'View less information',
      yearEstablished: 'Year Established',
      yearsInIndustry: 'Years in Industry',
      totalEmployees: 'Total Employees',
      qca: 'QCA Certified',
      minorityOwned: 'Minority Owned',
      unionAffiliated: 'Union Affiliated',
      standardProductionTime: 'Standard Production Time',
      rushTime: 'Rush Time',
      functions: 'Functions',
      decoratingMethods: 'Decorating Methods',
      fobPoints: 'FOB/Shipping Point(s)',
      artworkComments: 'Artwork Comments',
      marketingPolicy: 'Marketing Policy',
      distributionPolicy: 'Distribution Policy',
      safetyCompliance: 'Safety and Compliance documents',
      webPages: 'Web Pages',
      notes: 'Notes',
      addANote: 'Add a note',
      true: 'Yes',
      false: 'No',
      productLines: 'Product Lines',
    },
  },
});
