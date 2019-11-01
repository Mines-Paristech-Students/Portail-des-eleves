import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryManagerCatalogComponent } from './library-manager-catalog.component';

describe('LibraryManagerCatalogComponent', () => {
  let component: LibraryManagerCatalogComponent;
  let fixture: ComponentFixture<LibraryManagerCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryManagerCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryManagerCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
