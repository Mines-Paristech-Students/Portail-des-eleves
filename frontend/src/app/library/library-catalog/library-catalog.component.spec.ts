import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryCatalogComponent } from './library-catalog.component';

describe('LibraryCatalogComponent', () => {
  let component: LibraryCatalogComponent;
  let fixture: ComponentFixture<LibraryCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
