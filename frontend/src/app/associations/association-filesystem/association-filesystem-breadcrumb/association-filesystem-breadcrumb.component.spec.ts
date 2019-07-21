import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationFilesystemBreadcrumbComponent } from './association-filesystem-breadcrumb.component';

describe('AssociationFilesystemBreadcrumbComponent', () => {
  let component: AssociationFilesystemBreadcrumbComponent;
  let fixture: ComponentFixture<AssociationFilesystemBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationFilesystemBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationFilesystemBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
