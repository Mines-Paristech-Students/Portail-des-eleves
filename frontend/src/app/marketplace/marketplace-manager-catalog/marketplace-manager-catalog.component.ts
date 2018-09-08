import { Component, OnInit } from '@angular/core';
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";

@Component({
  selector: 'app-marketplace-seller-products',
  templateUrl: './marketplace-manager-catalog.component.html',
  styleUrls: ['./marketplace-manager-catalog.component.scss']
})
export class MarketplaceManagerCatalogComponent extends BaseMarketplaceComponent {

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
    }
}
