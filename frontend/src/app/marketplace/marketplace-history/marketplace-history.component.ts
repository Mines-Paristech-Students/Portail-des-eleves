import {Component} from '@angular/core';
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

    entries = [] ;

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
                orders => this.entries = this.entries
                    .concat(orders)
                    .sort((a, b) => a.date < b.date ? 1 : -1),
                error => this.error = error.message
            );

            this.api.get(`rest/funding/?marketplace=${id}&user=${user.id}`).subscribe(
                fundings => this.entries = this.entries
                    .concat(fundings)
                    .sort((a, b) => a.date < b.date ? 1 : -1)
                ,
                error => this.error = error.message
            );
		});
    }

    countItems(){
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace)
    }
}
