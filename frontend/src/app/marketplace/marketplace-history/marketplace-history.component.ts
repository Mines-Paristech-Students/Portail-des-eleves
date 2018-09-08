import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";

@Component({
    selector: 'app-marketplace-history',
    templateUrl: './marketplace-history.component.html',
    styleUrls: ['./marketplace-history.component.scss']
})
export class MarketplaceHistoryComponent implements OnInit {

    marketplace: any ;
    orders: any ;
    error: any ;

    numberOfItems = 0 ;
    basket: any ;

    constructor(private api: ApiService, private route: ActivatedRoute, private manager: BasketManagerServiceService){
        this.basket = this.manager.load()
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
