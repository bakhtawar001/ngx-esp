import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent, CoreModule } from './core';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,

    CoreModule.forRoot(),

    AppRoutingModule,
  ],
  bootstrap: [AppRootComponent],
})
export class AppModule {}
