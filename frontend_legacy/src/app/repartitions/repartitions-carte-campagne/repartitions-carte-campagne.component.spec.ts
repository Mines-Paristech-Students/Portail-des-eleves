import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionsCarteCampagneComponent } from './repartitions-carte-campagne.component';

describe('RepartitionsCarteCampagneComponent', () => {
  let component: RepartitionsCarteCampagneComponent;
  let fixture: ComponentFixture<RepartitionsCarteCampagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartitionsCarteCampagneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartitionsCarteCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
