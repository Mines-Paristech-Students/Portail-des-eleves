import { Component} from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ApiService } from "../../api.service";
import { Marketplace, Product, RawMarketplace } from './../models';
import { BasketManagerService } from "../basket-manager.service";
import { BaseMarketplaceComponent } from "../base-marketplace-component";

@Component({
  selector: 'app-marketplace-basket',
  templateUrl: './marketplace-basket.component.html',
  styleUrls: ['./marketplace-basket.component.scss']
})
export class MarketplaceBasketComponent extends BaseMarketplaceComponent {

    pendingOrders: any ;

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerService) {
        super(api, route, manager);
    }
    ngOnInit() {
		this.route.params.subscribe(params => {
            const id = params['id'];

            this.api.get<RawMarketplace>(`marketplace/${id}/`).subscribe(
                rawMarketplace => {
                    this.marketplace = new Marketplace(rawMarketplace);
                    this.countItems();
                },
                error => { this.error = error.message ; console.log(error) ; }
            );

            this.api.get(`orders/?status=ORDERED`).subscribe(
                orders => this.pendingOrders = orders,
                err => { this.error = err.message ; console.log(err) ; }
            )
		});
    }

    getQuantity(product: Product): number {
        return this.manager.getQuantity(this.basket, this.marketplace, product);
    }

    setQuantity(product: Product, quantity: number): void {
        this.manager.setQuantity(this.basket, this.marketplace, product, quantity);
        this.countItems();
    }

    order(): void {
        this.api.post("orders/", {
            products: this.inBasket(this.marketplace.products).map(p => { return { id: p.id, quantity: this.getQuantity(p)} })
        }).subscribe(
            res => {
                this.pendingOrders = this.pendingOrders.concat(res);
                this.manager.clear(this.basket, this.marketplace);
                this.countItems();
            },
            err => {this.error = err.message ; }

        )
    }

    inBasket(allProducts) {
        return allProducts.filter(product => this.getQuantity(product) > 0);
    }

    cancel(order){
        this.api.patch(
        `orders/${order.id}/`,
        { status: "CANCELLED" }
        ).subscribe(
            order => {
                let index = 0 ;
                // @ts-ignore
                while(this.pendingOrders[index].id != order.id){
                    index ++ ;
                }

                this.pendingOrders.splice(index, 1);
            },
            err => { this.error = err.message ; console.log(err) ; }
        )
    }

}
