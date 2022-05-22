import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SponsoredArticleComponentModule,
  SPONSORED_CONTENT_CONFIG,
} from '@contentful/sponsored-content';
import {
  AddProductsResponse,
  productToCollectionProduct,
} from '@esp/collections';
import { Product } from '@smartlink/models';
import { Supplier } from '@smartlink/suppliers';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CollectionsDialogService } from '../../../collections/services';

@Component({
  selector: 'esp-sponsored-page',
  templateUrl: './sponsored-article.page.html',
  styleUrls: ['./sponsored-article.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SPONSORED_CONTENT_CONFIG,
      useValue: environment.contentful.sponsoredContent,
    },
  ],
})
export class SponsoredArticlePage implements OnInit {
  articleId: string;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _collectionModalService: CollectionsDialogService
  ) {}

  ngOnInit(): void {
    this.articleId = this._activatedRoute.snapshot.params.id;
  }

  navigateToProductDetails(product: Product) {
    window.open(`products/${product.Id}`, '_blank');
  }

  navigateToSupplierDetails(supplier: Supplier) {
    window.open(`suppliers/${supplier.Id}`, '_blank');
  }

  async addToCollection(product: Product) {
    const collectionProduct = productToCollectionProduct(product);

    // This variable is meant to be used by the events
    const result: AddProductsResponse = await firstValueFrom(
      this._collectionModalService.addToCollection([collectionProduct])
    );
  }
}

@NgModule({
  declarations: [SponsoredArticlePage],
  imports: [CommonModule, SponsoredArticleComponentModule],
})
export class SponsoredArticlePageModule {}
