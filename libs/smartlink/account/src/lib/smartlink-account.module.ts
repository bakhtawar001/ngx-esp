import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AccountFacade, AccountService } from './services';
import { AccountState } from './store';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forFeature([AccountState]),
  ],
  providers: [AccountService, AccountFacade],
})
export class SmartlinkAccountModule {}
