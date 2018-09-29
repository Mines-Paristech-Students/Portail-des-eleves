import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceManagerCounterComponent } from './marketplace-manager-counter.component';

describe('MarketplaceManagerCounterComponent', () => {
  let component: MarketplaceManagerCounterComponent;
  let fixture: ComponentFixture<MarketplaceManagerCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceManagerCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceManagerCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
