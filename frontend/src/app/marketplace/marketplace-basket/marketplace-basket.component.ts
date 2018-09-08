import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";

@Component({
  selector: 'app-marketplace-basket',
  templateUrl: './marketplace-basket.component.html',
  styleUrls: ['./marketplace-basket.component.scss']
})
export class MarketplaceBasketComponent implements OnInit {
    marketplace: any ;
    error: any ;

    basket: any ;
    pendingOrders: any ;
    numberOfItems = 0 ;

    constructor(private api: ApiService, private route: ActivatedRoute, private manager: BasketManagerServiceService){
        this.basket = this.manager.load()
    }

    ngOnInit() {

		this.route.params.subscribe(
		(params) => {
            let id = params['id'];

            this.api.get(`rest/marketplace/${id}/`).subscribe(
                marketplace => {
                    this.marketplace = marketplace ;
                    this.countItems();
                },
                error => { this.error = error.message ; console.log(error) ; }
            );

            this.api.get(`rest/orders/?status=ORDERED`).subscribe(
                orders => this.pendingOrders = orders,
                err => { this.error = err.message ; console.log(err) ; }
            )
		});
    }

    order(){
        this.api.post("rest/orders/", {
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

    getQuantity(product){
        return this.manager.getQuantity(this.basket, this.marketplace, product);
    }

    setQuantity(product, value){
        let res =  this.manager.setQuantity(this.basket, this.marketplace, product, value);
        this.countItems();
        return res ;
    }

    add(product){
        this.manager.add(this.basket, this.marketplace, product) ;
        this.countItems();
    }

    remove(product){
        this.manager.remove(this.basket, this.marketplace, product) ;
        this.countItems() ;
    }

    countItems(){
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace)
    }

    cancel(order){
        this.api.patch(
        `rest/orders/${order.id}/`,
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
