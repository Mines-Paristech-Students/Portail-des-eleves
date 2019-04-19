import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociationFilesystemBrowserComponent } from "./association-filesystem-browser.component";

describe('AssociationFilesystemComponent', () => {
  let component: AssociationFilesystemBrowserComponent;
  let fixture: ComponentFixture<AssociationFilesystemBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationFilesystemBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationFilesystemBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
