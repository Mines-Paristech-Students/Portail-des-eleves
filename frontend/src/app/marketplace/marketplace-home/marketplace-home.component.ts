import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";
import {BaseMarketplaceComponent} from "../base-marketplace-component";

@Component({
  selector: 'app-marketplace-home',
  templateUrl: './marketplace-home.component.html',
  styleUrls: ['./marketplace-home.component.scss']
})
export class MarketplaceHomeComponent extends BaseMarketplaceComponent{

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
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
