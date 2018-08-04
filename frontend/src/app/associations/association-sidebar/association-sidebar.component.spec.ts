import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationSidebarComponent } from './association-sidebar.component';

describe('AssociationSidebarComponent', () => {
  let component: AssociationSidebarComponent;
  let fixture: ComponentFixture<AssociationSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
