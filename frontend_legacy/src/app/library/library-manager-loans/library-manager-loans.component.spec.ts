import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryManagerLoansComponent } from './library-manager-loans.component';

describe('LibraryManagerLoansComponent', () => {
  let component: LibraryManagerLoansComponent;
  let fixture: ComponentFixture<LibraryManagerLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryManagerLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryManagerLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
