import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VerticalNavigationItemComponent } from './vertical-navigation-item.component';

describe('VerticalNavigationItemComponent', () => {
  let component: VerticalNavigationItemComponent;
  let fixture: ComponentFixture<VerticalNavigationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalNavigationItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalNavigationItemComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
