import {
  ComponentFactory,
  Injectable,
  Injector,
  ModuleWithProviders,
  NgModuleRef,
  StaticProvider,
  Type,
  ɵNgModuleFactory,
} from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'any' })
export class ComponentLoader {
  private cache = new Map<Type<unknown>, ComponentFactory<unknown>>();

  constructor(private injector: Injector) {}

  resolveComponentFactory<M, C>(
    promise: Promise<{ module: Type<M>; component: Type<C> }>
  ): Observable<ComponentFactory<C>>;

  resolveComponentFactory<M, C>(
    promise: Promise<{
      module: ModuleWithProviders<M>;
      component: Type<C>;
    }>
  ): Observable<ComponentFactory<C>>;

  resolveComponentFactory<M, C>(
    promise:
      | Promise<{ module: Type<M>; component: Type<C> }>
      | Promise<{
          module: ModuleWithProviders<M>;
          component: Type<C>;
        }>
  ): Observable<ComponentFactory<C>> {
    return from(promise).pipe(
      map(({ module, component }) => {
        let providers: StaticProvider[] | undefined;

        if (isModuleWithProviders(module)) {
          providers = <StaticProvider[] | undefined>module.providers;
          module = module.ngModule;
        }

        if (this.cache.has(module)) {
          return <ComponentFactory<C>>this.cache.get(module);
        }

        const ngModuleFactory = new ɵNgModuleFactory<M>(module);
        const injector = providers
          ? Injector.create({ providers, parent: this.injector })
          : this.injector;
        const ngModuleRef: NgModuleRef<M> = ngModuleFactory.create(injector);

        const componentFactory: ComponentFactory<C> =
          ngModuleRef.componentFactoryResolver.resolveComponentFactory(
            component
          );

        this.cache.set(module, componentFactory);

        return componentFactory;
      })
    );
  }
}

function isModuleWithProviders<M>(
  module: Type<M> | ModuleWithProviders<M>
): module is ModuleWithProviders<M> {
  // eslint-disable-next-line no-prototype-builtins
  return module.hasOwnProperty('ngModule');
}
