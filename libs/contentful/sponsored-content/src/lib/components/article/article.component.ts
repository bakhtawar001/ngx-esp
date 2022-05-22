import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthTokenService } from '@asi/auth';
import { RootContentfulService } from '@contentful/common/services/root-contentful.service';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContentfulComponent } from '../contentful-component';
import { Product } from '@smartlink/models';

@Component({
  selector: 'sponsored-content-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent
  extends ContentfulComponent
  implements OnInit, OnChanges
{
  @Input() articleId: string;
  @Input() asiAuthHeader: string;
  @Input() layout = 'full';
  @Input() smartlinkUrl: string;
  @Input() readMoreText = 'Read full article';
  @Input() saveButtonText: string;
  @Input() orderButtonText: string;

  @Output() articleLoaded: EventEmitter<any> = new EventEmitter();
  @Output() productDetailClick: EventEmitter<Product> = new EventEmitter();
  @Output() productBuyClick: EventEmitter<Product> = new EventEmitter();
  @Output() productSaveClick: EventEmitter<Product> = new EventEmitter();
  @Output() supplierDetailClick: EventEmitter<Product> = new EventEmitter();
  @Output() productCardLoaded: EventEmitter<any> = new EventEmitter();
  @Output() articleDetailClick: EventEmitter<Product> = new EventEmitter();

  article$: Observable<any>;

  constructor(
    contentful: RootContentfulService,
    private sanitizer: DomSanitizer,
    private authTokenService: AuthTokenService
  ) {
    super(contentful);
  }

  override ngOnInit() {
    try {
      this.setConfig();
    } catch (e) {
      this.errorHandler(e);
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (changes.asiAuthHeader && changes.asiAuthHeader.currentValue) {
      this.authTokenService.reset({
        access_token: this.asiAuthHeader,
        expires_at: null,
      });
    }

    super.ngOnChanges(changes);

    if (this.authTokenService.token && this.contentful.hasClient) {
      this.getArticle();
    }
  }

  protected override setConfig(): void {
    if (this.asiAuthHeader) {
      this.authTokenService.reset({
        access_token: this.asiAuthHeader,
        expires_at: null,
      });
    }

    super.setConfig();
  }

  parseSanitizeDocument(document) {
    try {
      return this.sanitizer.bypassSecurityTrustHtml(
        documentToHtmlString(document)
      );
    } catch (e) {
      this.errorHandler(e);
    }
  }

  private getArticle() {
    this.article$ = this.contentful.getEntity(this.articleId).pipe(
      tap((article) => this.articleLoaded.next(article)),
      catchError((e, caught) => {
        this.errorHandler(e);

        return of(null);
      })
    );
  }
}
