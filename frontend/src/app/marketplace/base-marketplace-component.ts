import { OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "./basketManager.service";

export abstract class BaseMarketplaceComponent implements OnInit {

    protected marketplace: any ;
    protected error: any ;

    protected basket: any ;
    protected numberOfItems = 0 ;

    protected constructor(protected api: ApiService, protected route: ActivatedRoute, protected manager: BasketManagerServiceService){
        this.basket = this.manager.load();
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
		});
    }

    countItems(){
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace)
    }
}
