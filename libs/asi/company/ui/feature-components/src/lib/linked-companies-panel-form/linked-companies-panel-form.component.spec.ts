import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsiLinkedCompaniesPanelFormComponent } from './linked-companies-panel-form.component';

describe('LinkedCompaniesPanelFormComponent', () => {
  let component: AsiLinkedCompaniesPanelFormComponent;
  let fixture: ComponentFixture<AsiLinkedCompaniesPanelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsiLinkedCompaniesPanelFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsiLinkedCompaniesPanelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
