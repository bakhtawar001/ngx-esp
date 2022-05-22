import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  EditOrderContactDetailsComponent,
  EditOrderContactDetailsComponentModule,
} from './edit-order-contact-details.component';

describe('EditOrderContactDetailsComponent', () => {
  let spectator: Spectator<EditOrderContactDetailsComponent>;
  let component: EditOrderContactDetailsComponent;

  const createComponent = createComponentFactory({
    component: EditOrderContactDetailsComponent,
    imports: [EditOrderContactDetailsComponentModule, NgxsModule.forRoot()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
