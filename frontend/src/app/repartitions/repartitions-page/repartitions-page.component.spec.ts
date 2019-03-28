import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionsPageComponent } from './repartitions-page.component';

describe('RepartitionsPageComponent', () => {
  let component: RepartitionsPageComponent;
  let fixture: ComponentFixture<RepartitionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartitionsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartitionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
