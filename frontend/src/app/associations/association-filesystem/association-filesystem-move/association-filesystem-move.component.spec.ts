import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationFilesystemMoveComponent } from './association-filesystem-move.component';

describe('AssociationFilesystemMoveComponent', () => {
  let component: AssociationFilesystemMoveComponent;
  let fixture: ComponentFixture<AssociationFilesystemMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationFilesystemMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationFilesystemMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
