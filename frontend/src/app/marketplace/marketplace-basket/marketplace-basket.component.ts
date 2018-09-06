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
    numberOfItems = 0 ;

    constructor(private api: ApiService, private route: ActivatedRoute, private manager: BasketManagerServiceService){
        this.basket = this.manager.load()
    }
;
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
		});
    }

    order(){
        console.log(JSON.stringify(this.inBasket(this.marketplace.products)));
        this.api.post("association/marketplace/buy/", {
            products: this.inBasket(this.marketplace.products)
        }).subscribe(
            res => console.log(res),
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

}
