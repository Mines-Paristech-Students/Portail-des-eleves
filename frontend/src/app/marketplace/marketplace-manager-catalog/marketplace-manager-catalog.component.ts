import { Product } from './../models';
import { Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {BaseMarketplaceComponent} from "../base-marketplace-component";
import {ApiService} from "../../api.service";
import { BasketManagerService } from "../basket-manager.service";

@Component({
  selector: 'app-marketplace-seller-products',
  templateUrl: './marketplace-manager-catalog.component.html',
  styleUrls: ['./marketplace-manager-catalog.component.scss']
})
export class MarketplaceManagerCatalogComponent extends BaseMarketplaceComponent {

    editing = {} ;

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerService) {
        super(api, route, manager);
    }

    newProduct(): void {
        const product = {
            name: "Nouveau produit",
            price: 3.0,
            description: "",
            marketplace: this.marketplace.id,
            number_left: 10,
            still_in_the_catalogue: true,
            orderable_online: true
        };

        this.api.post<Product>("products/", product).subscribe(
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

            this.api.put(`products/${product.id}/`, product).subscribe(
                res => 0,
                err => {
                    this.error = err.message;
                    console.log(err)
                }
            );
        }
    }

    delete(product: Product): void {
        const index: number = this.marketplace.products.indexOf(product);
        if (index !== -1) {
            this.marketplace.products.splice(index, 1);
        }

        this.api.delete(`products/${product.id}/`).subscribe(
            res => 0,
            err => this.error = err.message
        )
    }

}
