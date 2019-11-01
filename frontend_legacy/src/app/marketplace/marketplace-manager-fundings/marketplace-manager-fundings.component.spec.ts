import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceManagerFundingsComponent } from './marketplace-manager-fundings.component';

describe('MarketplaceManagerFundingsComponent', () => {
  let component: MarketplaceManagerFundingsComponent;
  let fixture: ComponentFixture<MarketplaceManagerFundingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceManagerFundingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceManagerFundingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
