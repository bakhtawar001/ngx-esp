import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosPillModule } from '@cosmos/components/pill';
import { trackItem } from '@cosmos/core';
import { FormGroupComponent } from '@cosmos/forms';
import { FindLookupTypeValuePipeModule } from '@esp/lookup-types';
import { Company, Website } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import { CompanyWebsiteListFormModule } from '../company-website/company-website-list.form';
import { SocialMediaWebsitePipe } from './social-media-website.pipe';

@UntilDestroy()
@Component({
  selector: 'esp-company-website-list-panel-row-form',
  templateUrl: './company-website-list-panel-row.form.html',
  styleUrls: ['./company-website-list-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SocialMediaWebsitePipe],
})
export class CompanyWebsiteListPanelRowForm
  extends FormGroupComponent<{
    Websites: Website[];
  }>
  implements AfterContentInit
{
  readonly trackByFn = trackItem<Website>(['Url', 'IsPrimary']);

  isEditable = false;
  websites: Website[] = [];

  private readonly state$ = this.state.connect(this);

  constructor(
    @Inject(PARTY_LOCAL_STATE) public readonly state: PartyLocalState,
    private socialMediaPipe: SocialMediaWebsitePipe
  ) {
    super();
  }

  ngAfterContentInit(): void {
    this.initWebsites();
  }

  onCancel(): void {
    this.filterOutEmptyWebsites();
  }

  onSave(): void {
    this.filterOutEmptyWebsites();

    this.state.save({
      ...this.state.party,
      Websites: this.form.controls.Websites.value,
    });
  }

  private filterOutEmptyWebsites(): void {
    const websites = this.form.controls.Websites.value.filter(
      (website: Website) => website.Url !== ''
    );
    this.form.reset({ Websites: websites });
  }

  private initWebsites(): void {
    this.state$
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map(({ party }) => party),
        untilDestroyed(this)
      )
      .subscribe((party: Company) => {
        this.websites =
          this.socialMediaPipe.transform(party?.Websites, true) || [];
        this.isEditable = party?.IsEditable;
        this.form?.reset({ Websites: this.websites });
      });
  }
}

@NgModule({
  declarations: [CompanyWebsiteListPanelRowForm, SocialMediaWebsitePipe],
  exports: [CompanyWebsiteListPanelRowForm],
  imports: [
    CommonModule,
    CosPillModule,
    CosFormFieldModule,
    CompanyWebsiteListFormModule,
    FindLookupTypeValuePipeModule,
    AsiPanelEditableRowModule,
    ReactiveFormsModule,
  ],
})
export class CompanyWebsiteListPanelRowFormModule {}
