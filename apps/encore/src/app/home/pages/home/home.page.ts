/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { DocumentToHtmlPipeModule } from '@contentful/common/pipes/documentToHtml.pipe';
import { ContentfulService } from '@contentful/common/services/contentful.service';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosGlobalHeaderModule } from '@cosmos/components/global-header';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { GlobalSearchComponentModule } from '../../../core';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //-----------------------------------------------------------------------------
  // @Private Accessors
  //-------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // @Public Accessors
  //-------------------------------------------------------------------------------
  homepageContent$: Observable<any>;
  keywords;

  //-------------------------------------------------------------------------------
  // @Constructor
  //---------------------------------------------------------------------------------
  constructor(
    private readonly _contentfulService: ContentfulService,
    private _router: Router
  ) {
    _contentfulService.setConfig(
      environment.contentful.space,
      environment.contentful.accessToken,
      environment.contentful.environment
    );

    this._router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.keywords = '';
      });
  }

  //------------------------------------------------------------------------------------
  // @LifeCycle Hooks
  //------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.homepageContent$ = this._contentfulService
      .getEntity('1Pweu3Dlv82LbRq01QoMgo')
      .pipe(
        catchError((e) => {
          console.log(e);

          return of(null);
        })
      );
  }
}

//---------------------------------------------------------------------------------------
//@Scam Module
//-----------------------------------------------------------------------------------------
@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    CosCardModule,
    CosButtonModule,
    CosGlobalHeaderModule,
    GlobalSearchComponentModule,
    DocumentToHtmlPipeModule,
  ],
  exports: [HomePage],
})
export class HomePageModule {}
