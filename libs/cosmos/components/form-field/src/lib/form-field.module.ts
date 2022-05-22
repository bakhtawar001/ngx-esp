import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CosErrorDirective } from './error';
import { CosErrorComponent, COS_FORM_ERRORS, ErrorsMap } from './error.component';
import { CosFormField } from './form-field.component';
import { CosHint } from './hint';
import { CosLabel } from './label';
import { CosPrefix } from './prefix';
import { CosSuffix } from './suffix';

@NgModule({
  declarations: [
    CosErrorComponent,
    CosErrorDirective,
    CosFormField,
    CosHint,
    CosLabel,
    CosPrefix,
    CosSuffix,
  ],
  imports: [CommonModule, ObserversModule],
  exports: [
    CosErrorComponent,
    CosErrorDirective,
    CosFormField,
    CosHint,
    CosLabel,
    CosPrefix,
    CosSuffix,
  ],
})
export class CosFormFieldModule {
  static forRoot(
    errors: ErrorsMap = {}
  ): ModuleWithProviders<CosFormFieldModule> {
    return {
      ngModule: CosFormFieldModule,
      providers: [
        {
          provide: COS_FORM_ERRORS,
          useValue: errors,
        },
      ],
    };
  }
}
