import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceHistoryComponent } from './marketplace-history.component';

describe('MarketplaceHistoryComponent', () => {
  let component: MarketplaceHistoryComponent;
  let fixture: ComponentFixture<MarketplaceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
