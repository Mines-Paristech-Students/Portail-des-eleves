import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionsSidebarComponent } from './repartitions-sidebar.component';

describe('RepartitionsSidebarComponent', () => {
  let component: RepartitionsSidebarComponent;
  let fixture: ComponentFixture<RepartitionsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartitionsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartitionsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
