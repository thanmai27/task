import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskpopupComponent } from './taskpopup.component';

describe('TaskpopupComponent', () => {
  let component: TaskpopupComponent;
  let fixture: ComponentFixture<TaskpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
