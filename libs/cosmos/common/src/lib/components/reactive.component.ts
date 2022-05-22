import {
  Directive,
  OnDestroy,
  OnInit,
  ɵgetLContext as getLContext,
  ɵmarkDirty as markDirty,
} from '@angular/core';
import { ObservableDictionary } from '@cosmos/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { concat, from, ReplaySubject } from 'rxjs';
import { mergeMap, takeUntil, takeWhile, tap } from 'rxjs/operators';

const OnInitSubject = Symbol('OnInitSubject');
const OnDestroySubject = Symbol('OnDestroySubject');

const isIvy = (): boolean => {
  const ng: any = ((self || window) as any).ng;

  return (
    ng === undefined ||
    ng.getComponent !== undefined ||
    ng.applyChanges !== undefined
  );
};

@UntilDestroy()
@Directive()
export abstract class ReactiveComponent<T extends object = any>
  implements OnInit, OnDestroy {
  private [OnInitSubject] = new ReplaySubject<true>(1);
  private [OnDestroySubject] = new ReplaySubject<true>(1);

  public state: T = {} as T;

  /**
   * Constructor
   *
   */
  constructor() {
    this.onInit$.subscribe(() => this.setState.call(this));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this[OnInitSubject].next(true);
    this[OnInitSubject].complete();
  }

  ngOnDestroy(): void {
    this[OnDestroySubject].next(true);
    this[OnDestroySubject].complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  public get onInit$() {
    return this[OnInitSubject].asObservable();
  }

  public get onDestroy$() {
    return this[OnDestroySubject].asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  connect<T>(sources: ObservableDictionary<T>): T {
    const ivyEnabled = isIvy();
    if (!ivyEnabled) {
      console.error(
        'Ivy must be enabled in all environments, including testing. ' +
          'Please run `npx ngcc` in your project folder if you see this error in tests.'
      );
    }
    const sink = {} as T;
    const sourceKeys = Object.keys(sources) as (keyof T)[];
    const updateSink$ = from(sourceKeys).pipe(
      mergeMap((sourceKey) => {
        const source$ = sources[sourceKey];

        return source$.pipe(
          tap((sinkValue: any) => {
            sink[sourceKey] = sinkValue;
          })
        );
      })
    );

    concat(this.onInit$, updateSink$)
      .pipe(
        takeUntil(this.onDestroy$),
        takeWhile(() => ivyEnabled && !hasDetached(this))
      )
      .subscribe(() => {
        if (ivyEnabled) {
          markDirty(this);
        }
      });

    return sink;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  protected setState(): void {}

  protected detectChanges(): void {
    markDirty(this);
  }
}

function hasInitialised(component: any): boolean {
  if (!component) {
    return false;
  }
  const ngContextProp = '__ngContext__';
  return component[ngContextProp] !== undefined;
}

function hasDetached(component: any) {
  if (!hasInitialised(component)) {
    return false;
  }
  const lContext = getLContext(component);
  const FLAGS = 2;
  const componentNode = lContext?.lView[lContext.nodeIndex];
  const flags = componentNode?.[FLAGS];
  const DESTROYED_STATUS = 256;
  // tslint:disable-next-line: no-bitwise
  return flags & DESTROYED_STATUS;
}
