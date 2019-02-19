import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationFilesystemComponent } from './association-filesystem.component';

describe('AssociationFilesystemComponent', () => {
  let component: AssociationFilesystemComponent;
  let fixture: ComponentFixture<AssociationFilesystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationFilesystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationFilesystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
