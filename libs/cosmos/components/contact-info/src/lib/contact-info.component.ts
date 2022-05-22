import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type { Contact, Reference, Supplier } from '@smartlink/suppliers';

@Component({
  selector: 'cos-contact-info',
  templateUrl: 'contact-info.component.html',
  styleUrls: ['contact-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosContactInfoComponent {
  socialLinksOrder = [
    'facebook',
    'twitter',
    'instagram',
    'linkedin',
    'youtube',
  ];
  @HostBinding('class.cos-contact-info') mainClass = true;

  @Input() heading!: string;
  @Input() supplier!: Supplier;
  @Input() socialLinks = false;
  @Input() labels: any;
  @Input() contacts: Array<Contact> = [];
  @Input() references: Array<Reference> = [];

  get socialLinksSorted() {
    const sortedSocialLinks: string[] = [];
    this.socialLinksOrder.forEach((socialLink) => {
      const link = this.supplier.Websites?.find((item) =>
        item.includes(socialLink)
      );
      if (link) {
        sortedSocialLinks.push(link);
      }
    });
    return sortedSocialLinks;
  }

  get websiteAvailable() {
    const websites = this.supplier?.Websites?.filter(
      (website) => !this.socialLinksOrder.some((_) => website.includes(_))
    );
    return websites?.length! > 0;
  }
}
