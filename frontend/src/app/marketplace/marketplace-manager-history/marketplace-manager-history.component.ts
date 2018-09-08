import { Component, OnInit } from '@angular/core';
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import {BasketManagerServiceService} from "../basketManager.service";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../api.service";

@Component({
  selector: 'app-marketplace-seller-history',
  templateUrl: './marketplace-manager-history.component.html',
  styleUrls: ['./marketplace-manager-history.component.scss']
})
export class MarketplaceManagerHistoryComponent extends BaseMarketplaceComponent {

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
    }
}
