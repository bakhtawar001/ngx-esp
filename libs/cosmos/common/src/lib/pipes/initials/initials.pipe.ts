import {
  ModuleWithProviders,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    const firstLetters = name?.match(/\b\w/g) || [];

    const initials = (
      (firstLetters.shift() || '') + (firstLetters.pop() || '')
    ).toUpperCase();

    return initials;
  }
}

@NgModule({
  declarations: [InitialsPipe],
  exports: [InitialsPipe],
})
export class InitialsPipeModule {
  static withProvide(): ModuleWithProviders<InitialsPipeModule> {
    return {
      ngModule: InitialsPipeModule,
      providers: [InitialsPipe],
    };
  }
}
