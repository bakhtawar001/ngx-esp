import {
  CardsSelectionDialogComponent,
  CardsSelectionDialogComponentModule,
} from '../components';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MatDialogRef } from '@angular/material/dialog';

let component: CardsSelectionDialogComponent;
let spectator: Spectator<CardsSelectionDialogComponent>;
const createComponent = createComponentFactory({
  component: CardsSelectionDialogComponent,
  imports: [CardsSelectionDialogComponentModule],
  declarations: [CardsSelectionDialogComponent],
  providers: [{ provide: MatDialogRef, useValue: {} }],
});

beforeEach(() => {
  spectator = createComponent();
  component = spectator.component;
});

describe('CardsSelectionComponent', () => {
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
