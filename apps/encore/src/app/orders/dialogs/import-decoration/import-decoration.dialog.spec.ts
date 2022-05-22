import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDecorationDialog } from './import-decoration.dialog';

describe('ImportDecorationDialog', () => {
  let component: ImportDecorationDialog;
  let fixture: ComponentFixture<ImportDecorationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportDecorationDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDecorationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
