import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import {
  PresentationsSearchState,
  PresentationsState,
  PresentationProductState,
  PresentationProductOriginalPriceGridsState,
} from './states';

@NgModule({
  imports: [
    NgxsModule.forFeature([
      PresentationsSearchState,
      PresentationsState,
      PresentationProductState,
      PresentationProductOriginalPriceGridsState,
    ]),
  ],
})
export class EspPresentationsModule {}
