import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedCompaniesFormComponent } from './linked-companies-form.component';

describe('LinkedCompaniesFormComponent', () => {
  let component: LinkedCompaniesFormComponent;
  let fixture: ComponentFixture<LinkedCompaniesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkedCompaniesFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedCompaniesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
