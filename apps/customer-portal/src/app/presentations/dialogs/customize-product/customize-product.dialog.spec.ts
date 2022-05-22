import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { Subject } from 'rxjs';
import {
  CustomizeProductDialog,
  CustomizeProductDialogModule
} from './customize-product.dialog';

describe('Customize Product Dialog', () => {
  const backdropClickSubject: Subject<any> = new Subject();
  const createComponent = createComponentFactory({
    component: CustomizeProductDialog,
    imports: [CustomizeProductDialogModule, RouterTestingModule],
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
