import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceManagerOrdersComponent } from './marketplace-manager-orders.component';

describe('MarketplaceManagerOrdersComponent', () => {
  let component: MarketplaceManagerOrdersComponent;
  let fixture: ComponentFixture<MarketplaceManagerOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceManagerOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceManagerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
