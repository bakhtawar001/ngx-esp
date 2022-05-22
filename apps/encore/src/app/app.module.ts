import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InputMaskModule } from '@ngneat/input-mask';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth';
import { AppRootComponent, CoreModule } from './core';
@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,

    CoreModule.forRoot(),

    AppRoutingModule,

    AuthModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    NgxSkeletonLoaderModule.forRoot({
      animation: 'progress-dark',
      loadingText: 'loading...',
    }),
    InputMaskModule,
  ],
  bootstrap: [AppRootComponent],
})
export class AppModule {}
