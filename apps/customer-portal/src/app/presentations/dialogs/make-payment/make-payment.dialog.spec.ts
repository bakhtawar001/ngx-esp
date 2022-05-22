import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { Subject } from 'rxjs';
import {
  MakePaymentDialog,
  MakePaymentDialogModule
} from './make-payment.dialog';

describe('Make Payment Dialog', () => {
  const backdropClickSubject: Subject<any> = new Subject();
  const createComponent = createComponentFactory({
    component: MakePaymentDialog,
    imports: [MakePaymentDialogModule, RouterTestingModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
          backdropClick: () => backdropClickSubject,
        },
      },
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });
});
