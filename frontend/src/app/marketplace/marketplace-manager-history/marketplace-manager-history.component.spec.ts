import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceManagerHistoryComponent } from './marketplace-manager-history.component';

describe('MarketplaceManagerHistoryComponent', () => {
  let component: MarketplaceManagerHistoryComponent;
  let fixture: ComponentFixture<MarketplaceManagerHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceManagerHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceManagerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
