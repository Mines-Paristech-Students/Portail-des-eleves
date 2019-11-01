import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryLoansComponent } from './library-loans.component';

describe('LibraryLoansComponent', () => {
  let component: LibraryLoansComponent;
  let fixture: ComponentFixture<LibraryLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
