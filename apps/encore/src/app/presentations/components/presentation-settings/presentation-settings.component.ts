import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { Presentation, PresentationSettings } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PresentationLocalState } from '../../local-states';

interface PresentationSettingsToggle {
  label: string;
  settingName: keyof PresentationSettings;
  value: boolean;
  disabled: boolean;
}

const settingNameToLabelMap: Record<keyof PresentationSettings, string> = {
  ShowProductCPN: 'Product CPN',
  ShowProductPriceRanges: 'Price Range',
  ShowProductPricing: 'Pricing',
  ShowProductImprintMethods: 'Imprint Options',
  ShowProductAdditionalCharges: 'Additional Charges',
  ShowProductColors: 'Product Color',
  ShowProductSizes: 'Product Size',
  ShowProductShape: 'Product Shape',
  ShowProductMaterial: 'Product Material',
  // Leigh please add label here?
  ShowProductPriceGrids: 'Product Price Grids',
};

@UntilDestroy()
@Component({
  selector: 'esp-presentation-settings',
  templateUrl: './presentation-settings.component.html',
  styleUrls: ['./presentation-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationSettingsComponent implements OnInit {
  toggles: PresentationSettingsToggle[] = [
    {
      settingName: 'ShowProductCPN',
      value: false,
      disabled: false,
      label: 'Product CPN',
    },
    {
      settingName: 'ShowProductImprintMethods',
      value: false,
      disabled: false,
      label: 'Imprint Options',
    },
    {
      settingName: 'ShowProductPricing',
      value: false,
      disabled: false,
      label: 'Pricing',
    },
    {
      settingName: 'ShowProductPriceRanges',
      value: false,
      disabled: false,
      label: 'Price Range',
    },
    {
      settingName: 'ShowProductAdditionalCharges',
      value: false,
      disabled: false,
      label: 'Additional Charges',
    },
    {
      settingName: 'ShowProductColors',
      value: false,
      disabled: false,
      label: 'Product Color',
    },
    {
      settingName: 'ShowProductSizes',
      value: false,
      disabled: false,
      label: 'Product Size',
    },
    {
      settingName: 'ShowProductShape',
      value: false,
      disabled: false,
      label: 'Product Shape',
    },
    {
      settingName: 'ShowProductMaterial',
      value: false,
      disabled: false,
      label: 'Product Material',
    },
  ];

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly state: PresentationLocalState
  ) {}

  ngOnInit(): void {
    const settings = this.state.presentation.Settings;

    this.toggles.forEach((toggle) => {
      if (settings[toggle.settingName]) {
        toggle.value = settings[toggle.settingName];
      }
    });
  }

  updateSetting(toggle: PresentationSettingsToggle): void {
    toggle.disabled = true;
    const checked = !toggle.value;

    const presentation: Presentation = {
      ...this.state.presentation,
      Settings: {
        ...this.state.presentation.Settings,
        [toggle.settingName]: checked,
      },
    };

    this.state
      .save(presentation)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        toggle.disabled = false;
        toggle.value = checked;
        this.ref.detectChanges();
      });
  }
}

@NgModule({
  declarations: [PresentationSettingsComponent],
  imports: [CommonModule, ReactiveFormsModule, CosSlideToggleModule],
  exports: [PresentationSettingsComponent],
})
export class PresentationSettingsComponentModule {}
