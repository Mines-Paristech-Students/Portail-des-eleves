import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {ApiService} from "../../api.service";
import { BasketManagerService } from "../basket-manager.service";
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import { Marketplace, RawMarketplace } from '../models';

@Component({
    selector: 'app-marketplace-history',
    templateUrl: './marketplace-history.component.html',
    styleUrls: ['./marketplace-history.component.scss']
})
export class MarketplaceHistoryComponent extends BaseMarketplaceComponent{

    entries = [] ;

    p = 1 ; // The current page

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerService) {
        super(api, route, manager);
    }

    ngOnInit() {
        let user = JSON.parse(localStorage.getItem("user"));

		this.route.params.subscribe(params => {
			const id = params['id'];

            this.api.get<RawMarketplace>(`marketplace/${id}/`).subscribe(
                rawMarketplace => {
                    this.marketplace = new Marketplace(rawMarketplace);
                    this.countItems();
                },
                error => this.error = error.message
            );

            // @ts-ignore
            this.api.get(`orders/?marketplace=${id}&buyer=${user.id}`).subscribe(
                orders => this.entries = this.entries
                    .concat(orders)
                    .sort((a, b) => a.date < b.date ? 1 : -1),
                error => this.error = error.message
            );

            this.api.get(`funding/?marketplace=${id}&user=${user.id}`).subscribe(
                fundings => this.entries = this.entries
                    .concat(fundings)
                    .sort((a, b) => a.date < b.date ? 1 : -1)
                ,
                error => this.error = error.message
            );
		});
    }

    countItems(): void {
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace);
    }
}
