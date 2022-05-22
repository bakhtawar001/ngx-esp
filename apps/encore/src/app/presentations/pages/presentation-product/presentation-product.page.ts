import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import {
  CosImageUploadFormModule,
  CosImageUploadPreviewsListModule,
} from '@cosmos/components/image-upload-form';
import { CosInputModule } from '@cosmos/components/input';
import { CosProductNavigationModule } from '@cosmos/components/product-navigation';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { CosTableModule } from '@cosmos/components/table';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { FormControl } from '@cosmos/forms';
import { PresentationMedia, PresentationProductAttribute } from '@esp/models';
import { SupplierTrackEvent } from '@esp/products';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductImageComponentModule } from '@smartlink/products';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';
import { PresentationProductAdditionalChargesComponentModule } from '../../components/presentation-product-additional-charges/presentation-product-additional-charges.component';
import { PresentationProductImageComponentModule } from '../../components/presentation-product-image/presentation-product-image.component';
import { PresentationProductImagesComponentModule } from '../../components/presentation-product-images/presentation-product-images.component';
import { PresentationProductImprintComponentModule } from '../../components/presentation-product-imprint/presentation-product-imprint.component';
import { PresentationProductVariantComponentModule } from '../../components/presentation-product-variant/presentation-product-variant.component';
import { PresentationProductPriceGridsModule } from './components';
import { PresentationProductLoaderModule } from './presentation-product.loader';
import { PresentationProductLocalState } from './presentation-product.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-product',
  templateUrl: './presentation-product.page.html',
  styleUrls: ['./presentation-product.page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PresentationProductLocalState],
})
export class PresentationProductPage implements OnInit {
  private readonly state$ = this.state.connect(this);

  productImages: PresentationMedia[];

  form = this.createForm();

  primaryImage: string | null = null;

  checked = false;

  productAttributes: PresentationProductAttribute[] = [];

  displayedColumns5 = ['chargename', 'chargeqty', 'price'];

  dataSource5 = [];

  displayedColumns6 = ['charges', 'chargeqty', 'price', 'action'];

  dataSource6 = [
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
    {
      charges:
        'Shipping Charge - Split Shipments incur a handling charge per box',
      chargeqty: 'per product',
      price: '$15.00',
      action: '',
    },
  ];

  data = [{ name: 'Adult Softspun Semi-Fitted Tee', type: 'Product' }];

  uploadedProductImages = [
    ...new Array(45)
      .fill('')
      .map(
        (_, idx) => `https://api.uat-asicentral.com/v1/media/2409741${idx + 5}`
      ),
  ];

  get color() {
    return this.state?.product?.Attributes?.find(
      (attr) => attr.Type === 'PRCL'
    );
  }
  get size() {
    return this.state?.product?.Attributes?.find(
      (attr) => attr.Type === 'SIZE'
    );
  }
  get shape() {
    // Not sure about the shape type
    return this.state?.product?.Attributes?.find(
      (attr) => attr.Type === 'PRSP'
    );
  }
  get material() {
    return this.state?.product?.Attributes?.find(
      (attr) => attr.Type === 'MTRL'
    );
  }

  get defaultMedia() {
    return this.productImages.find((image) => image.IsVisible);
  }

  constructor(
    public readonly state: PresentationProductLocalState,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _analytics: CosAnalyticsService
  ) {
    const product$ = this.state$.pipe(
      map((x) => x.product),
      distinctUntilChanged((a, b) => a?.Id === b?.Id),
      untilDestroyed(this)
    );

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    product$.subscribe({
      next: (product) => {
        if (product) {
          this.form.reset(product);
          this.getMedia();
          this.productAttributes = product.Attributes;
        }
      },
    });
  }

  ngOnInit() {
    this._route.params
      .pipe(untilDestroyed(this))
      .subscribe((params) => this.state.getPresentation(params.presentationId));
  }

  private createForm() {
    return new FormGroup({
      Name: new FormControl('', Validators.required),
      Summary: new FormControl(''),
      Note: new FormControl(''),
    });
  }

  updateAttribute(attribute: PresentationProductAttribute) {
    const index = this.state.product.Attributes.findIndex(
      (x) => x.Id === attribute.Id
    );
    const attributes = [...this.state.product.Attributes];
    attributes[index] = attribute;
    this.productAttributes = [...attributes];
  }

  getMedia(): void {
    this.productImages = this.state.product.Media.map((media) => ({
      ...media,
    }));
    this.primaryImage =
      this.state.product.Media.find((media) => media.IsPrimary)?.Url || null;
  }

  goToSupplier(): void {
    const supplierTrack: TrackEvent<SupplierTrackEvent> = {
      action: 'Supplier Clicked',
      properties: {
        id: this.state.product.Supplier.AsiSupplierId,
        productId: this.state.product.Id,
      },
    };

    this._analytics.track(supplierTrack);
    window.open(`/suppliers/${this.state.product.Supplier?.AsiSupplierId}`);
  }

  save(): void {
    if (this.form.valid) {
      this.state.save({
        ...this.state.product,
        ...this.form.value,
        Attributes: this.productAttributes,
        Media: this.productImages,
      });
    }
  }

  delete(): void {
    const confirmDialog = this._dialog.open(CosConfirmDialog, {
      minWidth: '400px',
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this product?',
        confirm: 'Yes, remove this product',
        cancel: 'No, do not delete',
      },
    });

    confirmDialog
      .afterClosed()
      .pipe(
        filter((result) => result === true),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.state.delete();
      });
  }

  selectImage() {
    this.uploadedProductImages.unshift(
      'https://api.asicentral.com/v1/media/22624610?size=normal'
    );
  }

  filterFn(raw, normalizedProp, searchTerm) {
    return Object.values(raw).join().toLowerCase().includes(searchTerm);
  }

  backToPresentation() {
    this._router.navigate([
      '/projects',
      this.state?.presentation.ProjectId,
      'presentations',
      this.state?.presentation.Id,
    ]);
  }
}

@NgModule({
  declarations: [PresentationProductPage],
  exports: [PresentationProductPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MatMenuModule,

    CosAttributeTagModule,
    CosAccordionModule,
    CosAutocompleteModule,
    CosButtonModule,
    CosCardModule,
    CosCheckboxModule,
    CosFormFieldModule,
    CosImageUploadPreviewsListModule,
    CosImageUploadFormModule,
    CosInputModule,
    CosSlideToggleModule,
    CosSupplierModule,
    CosTableModule,
    CosProductNavigationModule,

    DetailHeaderComponentModule,
    PresentationProductAdditionalChargesComponentModule,
    PresentationProductVariantComponentModule,
    PresentationProductLoaderModule,
    PresentationProductImageComponentModule,
    PresentationProductImagesComponentModule,
    PresentationProductImprintComponentModule,
    ProductImageComponentModule,
    PresentationProductPriceGridsModule,
  ],
})
export class PresentationProductPageModule {}
