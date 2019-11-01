import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RerTimetableComponent } from './rer-timetable.component';

describe('RerTimetableComponent', () => {
  let component: RerTimetableComponent;
  let fixture: ComponentFixture<RerTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RerTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RerTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
