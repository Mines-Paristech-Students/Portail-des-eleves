import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationFilesystemFileComponent } from './association-filesystem-file.component';

describe('AssociationFilesystemFileComponent', () => {
  let component: AssociationFilesystemFileComponent;
  let fixture: ComponentFixture<AssociationFilesystemFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationFilesystemFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationFilesystemFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
