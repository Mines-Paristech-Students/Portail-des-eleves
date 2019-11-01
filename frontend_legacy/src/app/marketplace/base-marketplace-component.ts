import { OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ApiService } from "../api.service";
import { BasketManagerService } from "./basket-manager.service";
import { Basket, Marketplace, RawMarketplace } from './models';

export abstract class BaseMarketplaceComponent implements OnInit {
    protected marketplace: Marketplace ;
    protected error: any ;

    protected basket: Basket ;
    protected numberOfItems = 0 ;

    protected constructor(protected api: ApiService, protected route: ActivatedRoute, protected manager: BasketManagerService){
        this.basket = this.manager.load();
    }

    ngOnInit() {
		this.route.params.subscribe(
		(params) => {
            let id = params['id'];

            this.api.get<RawMarketplace>(`marketplace/${id}/`).subscribe(
                marketplace => {
                    this.marketplace = new Marketplace(marketplace) ;
                    this.countItems();
                },
                error => { this.error = error.message ; console.log(error) ; }
            );
		});
    }

    countItems(): void {
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace)
    }
}
