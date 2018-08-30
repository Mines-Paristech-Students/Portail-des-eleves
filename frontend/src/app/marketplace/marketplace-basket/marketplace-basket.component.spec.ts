import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceBasketComponent } from './marketplace-basket.component';

describe('MarketplaceBasketComponent', () => {
  let component: MarketplaceBasketComponent;
  let fixture: ComponentFixture<MarketplaceBasketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceBasketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
