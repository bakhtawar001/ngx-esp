import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthTokenService } from '@asi/auth';
import { RootContentfulService } from '@contentful/common/services/root-contentful.service';
import { SmartlinkAuthInterceptor } from '@smartlink/auth';
import { SMARTLINK_SERVICE_CONFIG } from '@smartlink/common';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './configs';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: SMARTLINK_SERVICE_CONFIG,
      useValue: { Url: environment.SMARTLINK_API },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SmartlinkAuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private contentful: RootContentfulService,
    private authTokenService: AuthTokenService
  ) {
    this.contentful.setGlobalConfig(environment.contentful.sponsoredContent);
    this.authTokenService.token = environment.SMARTLINK_AUTH;
  }
}
