import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";
import {BaseMarketplaceComponent} from "../base-marketplace-component";

@Component({
    selector: 'app-marketplace-history',
    templateUrl: './marketplace-history.component.html',
    styleUrls: ['./marketplace-history.component.scss']
})
export class MarketplaceHistoryComponent extends BaseMarketplaceComponent{

    orders: any ;
    p = 1 ; // The current page

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
    }

    ngOnInit() {
        let user = JSON.parse(localStorage.getItem("user"));

		this.route.params.subscribe(
		(params) => {
			let id = params['id'];

            this.api.get(`rest/marketplace/${id}/`).subscribe(
                marketplace => {
                    this.marketplace = marketplace;
                    this.countItems();
                },
                error => this.error = error.message
            );

            // @ts-ignore
            this.api.get(`rest/orders/?marketplace=${id}&buyer=${user.id}`).subscribe(
                orders => this.orders = orders,
                error => this.error = error.message
            );
		});
    }

    countItems(){
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace)
    }
}
