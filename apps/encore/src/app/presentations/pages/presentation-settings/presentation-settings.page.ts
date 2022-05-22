import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CosButtonModule } from '@cosmos/components/button';
import { CosButtonGroupModule } from '@cosmos/components/button-group';
import { CosCardModule } from '@cosmos/components/card';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { FormControl, FormGroupComponent } from '@cosmos/forms';
import { PresentationStatus } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { ProductRecommendationsCardModule } from '../../../core/components/cards';
import { PresentationInfoCardComponentModule } from '../../components/presentation-info-card/presentation-info-card.component';
import { PresentationPreviewComponentModule } from '../../components/presentation-preview/presentation-preview.component';
import { PresentationProductsComponentModule } from '../../components/presentation-products/presentation-products.component';
import { PresentationSettingsComponentModule } from '../../components/presentation-settings/presentation-settings.component';
import { toggleOptions as TOGGLE_OPTIONS } from '../../configs';
import { PresentationLocalState } from '../../local-states';
// Page state sub-components
import { MOCK_PRODUCT } from '../../mock_data/product_data.mock';
import { PresEmptyActionButtonsModule } from './components/empty_state/EmptyPageActions/EmptyPageAction.component';
import { PresPostShareActionButtonsModule } from './components/post_share_state/PostSharePageActions.component';
import { PresQuoteRequestComponentModule } from './components/quote_requested_state/PresentationQuoteRequest.compoent';
import { PresentationSettingsLoaderModule } from './presentation-settings.loader';

export interface SettingsForm {
  Note: string;
  ExpirationDate: string | null;
}

@UntilDestroy()
@Component({
  selector: 'esp-presentation-settings-page',
  templateUrl: './presentation-settings.page.html',
  styleUrls: ['./presentation-settings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PresentationLocalState],
})
export class PresentationSettingsPage
  extends FormGroupComponent
  implements AfterContentInit
{
  state$ = this.state.connect(this);
  presentationPhase = new FormControl('empty');
  mockedProduct = MOCK_PRODUCT;
  recoProducts = Array(4).fill(MOCK_PRODUCT);
  presentationProducts = Array(11).fill(MOCK_PRODUCT);
  toggleOptions = TOGGLE_OPTIONS;

  tempForm = this._fb.group<SettingsForm>({
    Note: [''],
    ExpirationDate: [null],
  });

  disabledToggles: Record<'AllowProductVariants' | 'ShowSignature', boolean> = {
    AllowProductVariants: false,
    ShowSignature: false,
  };

  PresentationStatus = PresentationStatus;

  constructor(
    private readonly ref: ChangeDetectorRef,
    public readonly state: PresentationLocalState
  ) {
    super();
  }

  protected override createForm() {
    return this._fb.group<SettingsForm>({
      Note: '',
      ExpirationDate: [null],
    });
  }

  ngAfterContentInit(): void {
    this.state$
      .pipe(
        map((state) => state.presentation),
        filter(Boolean),
        distinctUntilChanged((a, b) => a.Id === b.Id),
        untilDestroyed(this)
      )
      .subscribe((presentation) => {
        this.form.reset(presentation);

        this.resetNote();
        this.resetExpirationDate();
      });
  }

  override initForm() {
    this.state$
      .pipe(
        map((state) => state.presentation),
        filter(Boolean),
        switchMap(() => this.form.valueChanges),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.state.save({
          ...this.state.presentation,
          ...value,
        });
      });
  }

  resetNote() {
    this.tempForm.controls.Note.setValue(this.state.presentation.Note);
  }

  saveNote() {
    this.form.controls.Note.setValue(this.tempForm.controls.Note.value);
  }

  resetExpirationDate() {
    this.tempForm.controls.ExpirationDate.setValue(
      this.state.presentation.ExpirationDate
    );
  }

  saveExpirationDate() {
    if (this.tempForm.controls.ExpirationDate.valid) {
      this.form.controls.ExpirationDate.setValue(
        this.tempForm.controls.ExpirationDate.value
      );
    }
  }

  updatePhase(e) {
    this.state.updateStatus(e.value);
  }

  updateSharingOption(option: 'AllowProductVariants' | 'ShowSignature'): void {
    this.disabledToggles[option] = true;

    this.state
      .save({
        ...this.state.presentation,
        [option]: !this.state.presentation[option],
      })
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.disabledToggles[option] = false;
        this.ref.detectChanges();
      });
  }
}

@NgModule({
  declarations: [PresentationSettingsPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTooltipModule,

    CosButtonModule,
    CosButtonGroupModule,
    CosCardModule,
    CosFormFieldModule,
    CosInputModule,
    CosSlideToggleModule,

    ProductRecommendationsCardModule,
    PresentationInfoCardComponentModule,
    PresentationSettingsLoaderModule,
    PresentationSettingsComponentModule,
    PresentationPreviewComponentModule,
    PresentationProductsComponentModule,

    // empty state sub-components
    PresEmptyActionButtonsModule,
    PresPostShareActionButtonsModule,
    PresQuoteRequestComponentModule,
  ],
  exports: [PresentationSettingsPage],
})
export class PresentationSettingsPageModule {}
