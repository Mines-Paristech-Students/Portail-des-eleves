import { Component, OnInit } from '@angular/core';
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";

@Component({
  selector: 'app-marketplace-seller-products',
  templateUrl: './marketplace-manager-catalog.component.html',
  styleUrls: ['./marketplace-manager-catalog.component.scss']
})
export class MarketplaceManagerCatalogComponent extends BaseMarketplaceComponent {

    editing = {} ;

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
    }

    newProduct(){
        let product = {
            name: "Nouveau produit",
            price: 3.0,
            comment: "",
            marketplace: this.marketplace.id,
            number_left: 10,
            still_in_the_catalogue: true,
            orderable_online: true
        };

        console.log(product);

        this.api.post("rest/products/", product).subscribe(
            product => {
                this.marketplace.products.push(product) ;
                // @ts-ignore
                this.editing[product.id] = true
            },
            err => this.error = err.message
        )
    }

    startEdit(product){
        this.editing[product.id] = true ;
    }

    endEdit(product){
        if(product.name != "" && product.number_left >= -1) {
            this.editing[product.id] = false;

            this.api.put(`rest/products/${product.id}/`, product).subscribe(
                res => 0,
                err => {
                    this.error = err.message;
                    console.log(err)
                }
            );
        }
    }

    delete(product){
        const index: number = this.marketplace.products.indexOf(product);
        if (index !== -1) {
            this.marketplace.products.splice(index, 1);
        }

        this.api.delete(`rest/products/${product.id}/`).subscribe(
            res => 0,
            err => this.error = err.message
        )
    }

}
