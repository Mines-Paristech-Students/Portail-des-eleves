import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";

@Component({
  selector: 'app-marketplace-home',
  templateUrl: './marketplace-home.component.html',
  styleUrls: ['./marketplace-home.component.scss']
})
export class MarketplaceHomeComponent implements OnInit {

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
