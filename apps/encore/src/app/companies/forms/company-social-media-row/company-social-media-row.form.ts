import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { ValidateUrl } from '@cosmos/common';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import {
  Company,
  SocialMediaWebsiteType,
  Website,
  WebsiteTypeEnum,
} from '@esp/models';
import {
  SocialMediaFormModel,
  SocialMediaFormModule,
  SocialMediaFormPrefix,
} from '@esp/settings';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import { CompanyDetailLocalState } from '../../local-states';

interface CompanySocialMedia {
  [key: string]: SocialMediaValue;
}

type SocialMediaValue = {
  redirectUrl: string;
  value: string;
  type: SocialMediaWebsiteType;
  displayValue: string;
};

enum SocialMediaRedirectUrl {
  Facebook = 'www.facebook.com/',
  Instagram = 'www.instagram.com/',
  LinkedIn = 'www.linkedin.com/',
  Pinterest = 'www.pinterest.com/',
  Twitter = 'www.twitter.com/',
  Other = '',
}

@UntilDestroy()
@Component({
  selector: 'esp-company-social-media-row',
  templateUrl: './company-social-media-row.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySocialMediaRowForm
  extends FormGroupComponent<SocialMediaFormModel>
  implements OnInit
{
  companySocialMedia?: CompanySocialMedia;
  company?: Company;
  isAnySocialMediaAdded = false;

  private readonly state$ = this.state.connect(this);
  readonly originalOrder = () => 0;

  constructor(readonly state: CompanyDetailLocalState) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.initWebsites();
  }

  onSocialMediaSave(): void {
    const initialWebsites = this.company.Websites;
    const socialMediaWebsites: Website[] = [
      this.mapSocialMediaToWebsite(
        initialWebsites,
        WebsiteTypeEnum.Facebook,
        this.form.controls.Facebook.value
      ),
      this.mapSocialMediaToWebsite(
        initialWebsites,
        WebsiteTypeEnum.LinkedIn,
        this.form.controls.LinkedIn.value
      ),
      this.mapSocialMediaToWebsite(
        initialWebsites,
        WebsiteTypeEnum.Pinterest,
        this.form.controls.Pinterest.value
      ),
      this.mapSocialMediaToWebsite(
        initialWebsites,
        WebsiteTypeEnum.Twitter,
        this.form.controls.Twitter.value
      ),
      this.mapSocialMediaToWebsite(
        initialWebsites,
        WebsiteTypeEnum.Other,
        this.form.controls.Other.value
      ),
    ];

    const types = new Set(socialMediaWebsites.map((w) => w && w.Type));

    const updatedWebsites: Website[] = [
      ...socialMediaWebsites,
      ...initialWebsites.filter((w) => !types.has(w.Type)),
    ].filter((w) => w.Url);

    this.state.save({
      ...this.state.party,
      Websites: updatedWebsites,
    });
  }

  override createForm(): FormGroup<SocialMediaFormModel> {
    return this._fb.group<SocialMediaFormModel>({
      Facebook: [''],
      Instagram: [''],
      LinkedIn: [''],
      Pinterest: [''],
      Twitter: [''],
      Other: ['', [ValidateUrl]],
    });
  }

  private mapSocialMediaToWebsite(
    initialWebsites: Website[],
    type: WebsiteTypeEnum,
    url: string
  ): Website {
    const initialWebsite = initialWebsites.find((w) => w.Type === type);
    if (!initialWebsite) {
      return {
        Type: type,
        IsPrimary: false,
        Url: url,
      };
    } else {
      return {
        ...initialWebsite,
        Url: url,
      };
    }
  }

  private getSocialMediaValue(
    websites: Website[],
    type: SocialMediaWebsiteType
  ): SocialMediaValue | null {
    const url = websites?.find((w) => w.Type === type)?.Url;
    if (!url) {
      return null;
    }
    return {
      redirectUrl: SocialMediaRedirectUrl[type] + url,
      value: url,
      type,
      displayValue: SocialMediaFormPrefix[type] + url,
    };
  }

  private initWebsites(): void {
    this.state$
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map(({ party }) => party),
        untilDestroyed(this)
      )
      .subscribe((party: Company) => {
        this.company = party;
        const websites = party.Websites;

        this.companySocialMedia = {
          Facebook: this.getSocialMediaValue(
            websites,
            WebsiteTypeEnum.Facebook
          ),
          Instagram: this.getSocialMediaValue(
            websites,
            WebsiteTypeEnum.Instagram
          ),
          LinkedIn: this.getSocialMediaValue(
            websites,
            WebsiteTypeEnum.LinkedIn
          ),
          Pinterest: this.getSocialMediaValue(
            websites,
            WebsiteTypeEnum.Pinterest
          ),
          Twitter: this.getSocialMediaValue(websites, WebsiteTypeEnum.Twitter),
          Other: this.getSocialMediaValue(websites, WebsiteTypeEnum.Other),
        };

        this.isAnySocialMediaAdded = !!Object.values(
          this.companySocialMedia
        ).filter(Boolean).length;

        this.form.reset({
          Facebook: this.companySocialMedia.Facebook?.value,
          Instagram: this.companySocialMedia.Instagram?.value,
          LinkedIn: this.companySocialMedia.LinkedIn?.value,
          Pinterest: this.companySocialMedia.Pinterest?.value,
          Twitter: this.companySocialMedia.Twitter?.value,
          Other: this.companySocialMedia.Other?.value,
        });
      });
  }
}

@NgModule({
  declarations: [CompanySocialMediaRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsiPanelEditableRowModule,
    CosInputModule,
    SocialMediaFormModule,
  ],
  exports: [CompanySocialMediaRowForm],
})
export class CompanySocialMediaRowFormModule {}
