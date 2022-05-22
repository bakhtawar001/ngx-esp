import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { SelectOrderDialogSearchLocalState } from './select-order-dialog.local-state';
import {
  SelectOrderDialog,
  SelectOrderDialogModule,
} from './select-order.dialog';

const createComponent = createComponentFactory({
  component: SelectOrderDialog,
  imports: [SelectOrderDialogModule, NgxsModule.forRoot(), RouterTestingModule],
  providers: [
    MockProvider(MatDialogRef, {
      afterOpened: () => EMPTY,
      backdropClick: () => EMPTY,
    }),
  ],
});

const testSetup = () => {
  const spectator = createComponent({
    providers: [
      MockProvider(SelectOrderDialogSearchLocalState, {
        connect: () => EMPTY,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        search: () => {},
      }),
    ],
  });

  return {
    spectator,
    component: spectator.component,
    state: spectator.inject(SelectOrderDialogSearchLocalState, true),
  };
};

describe('SelectOrderComponent', () => {
  it('should create', () => {
    const { spectator } = testSetup();
    expect(spectator).toBeTruthy();
  });
});
