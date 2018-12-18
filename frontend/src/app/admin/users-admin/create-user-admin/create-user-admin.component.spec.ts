import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserAdminComponent } from './create-user-admin.component';

describe('CreateUserAdminComponent', () => {
  let component: CreateUserAdminComponent;
  let fixture: ComponentFixture<CreateUserAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
