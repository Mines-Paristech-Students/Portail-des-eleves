import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationsAdminComponent } from './associations-admin.component';

describe('AssociationsAdminComponent', () => {
  let component: AssociationsAdminComponent;
  let fixture: ComponentFixture<AssociationsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
