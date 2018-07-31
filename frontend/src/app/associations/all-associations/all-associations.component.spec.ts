import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAssociationsComponent } from './all-associations.component';

describe('AllAssociationsComponent', () => {
  let component: AllAssociationsComponent;
  let fixture: ComponentFixture<AllAssociationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAssociationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
