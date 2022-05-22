import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsiDateRangeSelectComponent } from './date-range-select.component';

describe('AsiDateRangeSelectComponent', () => {
  let component: AsiDateRangeSelectComponent;
  let fixture: ComponentFixture<AsiDateRangeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsiDateRangeSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsiDateRangeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
