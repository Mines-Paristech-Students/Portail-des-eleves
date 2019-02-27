import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

import { ApiService } from "../../api.service";
import { BasketManagerService } from "../basket-manager.service";
import { BaseMarketplaceComponent } from "../base-marketplace-component";
import { Marketplace, Product, RawMarketplace } from '../models';

@Component({
  selector: 'app-marketplace-home',
  templateUrl: './marketplace-home.component.html',
  styleUrls: ['./marketplace-home.component.scss']
})
export class MarketplaceHomeComponent extends BaseMarketplaceComponent{

    p = 0; // The current page
    products: any;

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerService) {
        super(api, route, manager);
    }

    ngOnInit() {
		this.route.params.subscribe(params => {
            const id = params['id'];

            const marketPlaceRequest = this.api.get<RawMarketplace>(`marketplace/${id}/`).pipe(
                map(rawMarketplace => new Marketplace(rawMarketplace)),
            );

            marketPlaceRequest.subscribe(
                marketplace => {
                    this.marketplace = marketplace;
                    this.countItems();
                },
                error => { this.error = error.message; console.log(error); }
            );

            this.products = marketPlaceRequest.pipe(
                map(marketplace => marketplace.products),
            );
		});
    }

    getQuantity(product: Product): number {
        console.log('get quantity')
        return this.manager.getQuantity(this.basket, this.marketplace, product);
    }

    setQuantity(product: Product, value: number): void {
        this.manager.setQuantity(this.basket, this.marketplace, product, value);
        this.countItems();
    }

    add(product: Product): void {
        this.manager.add(this.basket, this.marketplace, product) ;
        this.countItems();
    }

    remove(product: Product): void {
        this.manager.remove(this.basket, this.marketplace, product) ;
        this.countItems() ;
    }

}
