import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationShowComponent } from './association-show.component';

describe('AssociationShowComponent', () => {
  let component: AssociationShowComponent;
  let fixture: ComponentFixture<AssociationShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
