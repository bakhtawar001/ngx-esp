import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  EditableOrderContactComponent,
  EditableOrderContactComponentModule,
} from './editable-order-contact.component';

describe('EditableOrderContactComponent', () => {
  let spectator: Spectator<EditableOrderContactComponent>;
  let component: EditableOrderContactComponent;

  const createComponent = createComponentFactory({
    component: EditableOrderContactComponent,
    imports: [
      HttpClientTestingModule,
      EditableOrderContactComponentModule,
      NgxsModule.forRoot(),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
