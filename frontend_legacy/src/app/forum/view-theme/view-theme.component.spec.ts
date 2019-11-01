import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewThemeComponent } from './view-theme.component';

describe('ViewThemeComponent', () => {
  let component: ViewThemeComponent;
  let fixture: ComponentFixture<ViewThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
