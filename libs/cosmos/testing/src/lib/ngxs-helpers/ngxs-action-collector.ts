import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { Actions } from '@ngxs/store';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export enum ActionStatus {
  Dispatched = 'DISPATCHED',
  Successful = 'SUCCESSFUL',
  Canceled = 'CANCELED',
  Errored = 'ERRORED',
}

@Injectable({ providedIn: 'root' })
export class NgxsActionCollector implements OnDestroy {
  /**
   * Including this in your imported modules will
   * set up the the action collector to start collecting actions
   * from before Ngxs initializes
   * @example
   * // In your module declaration for your tests:
   * {
   *   imports: [
   *     NgxsActionCollector.collectActions(),
   *     NgxsModule.forRoot([MyState]),
   *   ],
   *   // ...
   * }
   * // and then in your test:
   * const actionCollector = TestBed.inject(NgxsActionCollector);
   * const actionsDispatched = actionCollector.dispatched;
   * const action = actionsDispatched.find(
   *   (item) => item instanceof MyAction
   * );
   * expect(action).toBeDefined();
   * @returns A module that starts the collector immediately
   */
  public static collectActions(): ModuleWithProviders<any> {
    @NgModule()
    class NgxsActionCollectorModule {
      constructor(collectorService: NgxsActionCollector) {
        collectorService.start();
      }
    }
    return {
      ngModule: NgxsActionCollectorModule,
      providers: [Actions, NgxsActionCollector],
    };
  }

  private destroyed$ = new ReplaySubject<void>(1);
  private stopped$ = new Subject<void>();
  private started = false;

  public readonly dispatched: any[] = [];
  public readonly completed: any[] = [];
  public readonly successful: any[] = [];
  public readonly errored: any[] = [];
  public readonly cancelled: any[] = [];

  constructor(private actions$: Actions) {}

  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.actions$
      .pipe(takeUntil(this.destroyed$), takeUntil(this.stopped$))
      .subscribe({
        next: (actionCtx: { status: ActionStatus; action: any }) => {
          switch (actionCtx?.status) {
            case ActionStatus.Dispatched:
              this.dispatched.push(actionCtx.action);
              break;
            case ActionStatus.Successful:
              this.successful.push(actionCtx.action);
              this.completed.push(actionCtx.action);
              break;
            case ActionStatus.Errored:
              this.errored.push(actionCtx.action);
              this.completed.push(actionCtx.action);
              break;
            case ActionStatus.Canceled:
              this.cancelled.push(actionCtx.action);
              this.completed.push(actionCtx.action);
              break;
            default:
              break;
          }
        },
        complete: () => {
          this.started = false;
        },
        error: () => {
          this.started = false;
        },
      });
  }

  reset() {
    function clearArray(arr: any[]) {
      arr.splice(0, arr.length);
    }
    clearArray(this.dispatched);
    clearArray(this.completed);
    clearArray(this.successful);
    clearArray(this.errored);
    clearArray(this.cancelled);
  }

  stop() {
    this.stopped$.next();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
