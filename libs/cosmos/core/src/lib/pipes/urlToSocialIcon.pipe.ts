import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UrlToSocialIcon' })
export class UrlToSocialIconPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {string} url
   * @returns {string}
   */
  transform(url: string): string {
    const socialIcons = {
      facebook: 'fa-facebook-square',
      instagram: 'fa-instagram-square',
      linkedin: 'fa-linkedin',
      twitter: 'fa-twitter-square',
      youtube: 'fa-youtube-square',
    };
    const platforms = Object.keys(socialIcons);
    const platform = <keyof typeof socialIcons>(
      platforms.find((x) => url.includes(x))
    );
    return socialIcons[platform];
  }
}

@NgModule({
  declarations: [UrlToSocialIconPipe],
  exports: [UrlToSocialIconPipe],
})
export class UrlToSocialIconPipeModule {}
