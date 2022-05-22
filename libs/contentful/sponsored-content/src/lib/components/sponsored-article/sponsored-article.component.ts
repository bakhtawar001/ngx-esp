import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DocumentToHtmlPipeModule } from '@contentful/common/pipes/documentToHtml.pipe';
import { ContentfulService } from '@contentful/common/services/contentful.service';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { SuppliersService } from '@esp/suppliers';
import { Product } from '@smartlink/models';
import {
  SponsoredProductCardComponentModule,
  SponsoredProductComponentModule,
} from '@smartlink/products';
import { Supplier } from '@smartlink/suppliers';
import { CreateClientParams } from 'contentful';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { SPONSORED_CONTENT_CONFIG } from '../../configs';

@Component({
  selector: 'sponsored-content-article',
  templateUrl: './sponsored-article.component.html',
  styleUrls: ['./sponsored-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsoredArticleComponent implements OnChanges {
  @Input() articleId: string;
  @Output() productDetailClick = new EventEmitter<Product>();
  @Output() supplierDetailClick = new EventEmitter<Supplier>();
  @Output() addToCollectionClick = new EventEmitter<Product>();

  article$: Observable<any>;
  supplier$: Observable<Supplier>;

  constructor(
    private readonly _contentfulService: ContentfulService,
    private readonly _supplierService: SuppliersService,
    @Inject(SPONSORED_CONTENT_CONFIG)
    private readonly _contentfulConfig: CreateClientParams
  ) {
    const sponsoredContentConfig = this._contentfulConfig;
    if (sponsoredContentConfig) {
      const { space, accessToken, environment, host } = sponsoredContentConfig;

      this._contentfulService.setConfig(space, accessToken, environment, host);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this._contentfulService.hasClient &&
      changes.articleId.currentValue !== changes.articleId.previousValue
    ) {
      this.article$ = this._contentfulService
        .getEntity(changes.articleId.currentValue)
        .pipe(
          switchMap((article: any) => {
            this.supplier$ = this.getSupplierByAsiNumber(
              article.fields.sponsoredBy.fields.asiNumber
            );

            return of(article);
          })
        );
    }
  }

  private getSupplierByAsiNumber(asiNumber: string) {
    return this._supplierService.getByAsiNumber(asiNumber).pipe(shareReplay(1));
  }
}

@NgModule({
  declarations: [SponsoredArticleComponent],
  imports: [
    CommonModule,
    SponsoredProductComponentModule,
    SponsoredProductCardComponentModule,
    DocumentToHtmlPipeModule,
    CosSupplierModule,
  ],
  exports: [SponsoredArticleComponent],
})
export class SponsoredArticleComponentModule {}
