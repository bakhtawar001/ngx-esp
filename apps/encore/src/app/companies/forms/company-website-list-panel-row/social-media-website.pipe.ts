import { Pipe, PipeTransform } from '@angular/core';
import { Website, WebsiteTypeEnum } from '@esp/models';

@Pipe({
  name: 'socialMediaWebsites',
})
export class SocialMediaWebsitePipe implements PipeTransform {
  transform(websites: Website[], filterSocial: boolean): Website[] {
    return websites?.filter((w) =>
      filterSocial
        ? !this.isTypeSocialMedia(w.Type)
        : this.isTypeSocialMedia(w.Type)
    );
  }

  private isTypeSocialMedia(type: WebsiteTypeEnum): boolean {
    return (
      type === WebsiteTypeEnum.Facebook ||
      type === WebsiteTypeEnum.Instagram ||
      type === WebsiteTypeEnum.LinkedIn ||
      type === WebsiteTypeEnum.Pinterest ||
      type === WebsiteTypeEnum.Twitter ||
      type === WebsiteTypeEnum.Other
    );
  }
}
