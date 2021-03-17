import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DboardComponent } from './dboard.component';

describe('DboardComponent', () => {
  let component: DboardComponent;
  let fixture: ComponentFixture<DboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
