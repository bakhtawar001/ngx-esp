import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from '../services';
import { FullFlowContext } from './full-flow-context';

@Injectable({ providedIn: 'root' })
export class DialogFlowFactoryService {
  constructor(
    private readonly dialogService: DialogService,
    private ngZone: NgZone
  ) {}

  create(config: { onReset?: () => void; destroyed$: Observable<void> }) {
    return new FullFlowContext(this.dialogService, this.ngZone, {
      onReset: () => config.onReset?.(),
      destroyed$: config.destroyed$,
    });
  }
}
