import { Component } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import {map, mergeMap, scan} from "rxjs/operators";

@Component({
  selector: 'app-marketplace-home',
  templateUrl: './marketplace-home.component.html',
  styleUrls: ['./marketplace-home.component.scss']
})
export class MarketplaceHomeComponent extends BaseMarketplaceComponent{

    p = 0; // The current page
    products: any;

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
    }

    ngOnInit() {
		this.route.params.subscribe(
		(params) => {
            let id = params['id'];

            let req = this.api.get(`marketplace/${id}/`);

            req.subscribe(
                marketplace => {
                    this.marketplace = marketplace ;
                    this.countItems();
                },
                error => { this.error = error.message ; console.log(error) ; }
            );

            this.products = req.pipe(
                // @ts-ignore
                map(m => m.products),
                mergeMap(p => p),
                // @ts-ignore
                scan((acc, value) => [...acc, value], [])
            );
		});
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

}
