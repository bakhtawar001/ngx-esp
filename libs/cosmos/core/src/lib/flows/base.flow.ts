import { Injectable, OnDestroy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DialogFlowFactoryService } from './dialog-flow-factory.service';
import { ReplaySubject } from 'rxjs';

@UntilDestroy()
@Injectable()
export class BaseFlow implements OnDestroy {
  constructor(private readonly dialogFlowService: DialogFlowFactoryService) {}

  protected destroyed$ = new ReplaySubject<void>();

  protected flow = this.dialogFlowService.create({
    onReset: () => this.reset(),
    destroyed$: this.destroyed$,
  });

  protected reset(): void {
    return;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
