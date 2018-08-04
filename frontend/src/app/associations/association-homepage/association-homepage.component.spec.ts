import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationHomepageComponent } from './association-homepage.component';

describe('AssociationHomepageComponent', () => {
  let component: AssociationHomepageComponent;
  let fixture: ComponentFixture<AssociationHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
