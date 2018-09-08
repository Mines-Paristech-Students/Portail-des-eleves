import { Component, OnInit } from '@angular/core';
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";

@Component({
  selector: 'app-marketplace-seller-pending',
  templateUrl: './marketplace-manager-orders.component.html',
  styleUrls: ['./marketplace-manager-orders.component.scss']
})
export class MarketplaceManagerOrdersComponent extends BaseMarketplaceComponent {

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
    }
}
