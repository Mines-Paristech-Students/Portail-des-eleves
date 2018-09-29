import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationSettingsComponent } from './association-settings.component';

describe('AssociationSettingsComponent', () => {
  let component: AssociationSettingsComponent;
  let fixture: ComponentFixture<AssociationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
