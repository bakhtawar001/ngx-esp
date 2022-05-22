import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AutocompleteState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([AutocompleteState])],
})
export class EspAutocompleteModule {}
