import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceManagerCatalogComponent } from './marketplace-manager-catalog.component';

describe('MarketplaceManagerCatalogComponent', () => {
  let component: MarketplaceManagerCatalogComponent;
  let fixture: ComponentFixture<MarketplaceManagerCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceManagerCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceManagerCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
