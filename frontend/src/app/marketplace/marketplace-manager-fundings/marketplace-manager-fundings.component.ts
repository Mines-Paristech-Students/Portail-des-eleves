import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {ApiService} from "../../api.service";
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import { BasketManagerService } from "../basket-manager.service";
import { Marketplace, RawMarketplace } from '../models';

@Component({
  selector: 'app-marketplace-manager-fundings',
  templateUrl: './marketplace-manager-fundings.component.html',
  styleUrls: ['./marketplace-manager-fundings.component.scss']
})
export class MarketplaceManagerFundingsComponent extends BaseMarketplaceComponent {

    fundings: any;
    p = 1; // The current page

    marketplace_id: any ;

    filter = {
        date: "",
        status: [],
        users: []
    };

    users: any ;

    status = [
        {value: "FUNDED", label: "Versé", color: "lime"},
        {value: "REFUNDED", label: "Remboursé", color: "yellow"}
    ] ;

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerService) {
        super(api, route, manager);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.marketplace_id = params['id'];

            this.api.get<RawMarketplace>(`marketplace/${this.marketplace_id}/`).subscribe(
                rawMarketplace => {
                    this.marketplace = new Marketplace(rawMarketplace);
                    this.countItems();
                },
                error => this.error = error.message
            );

            this.fundings = this.api.get(`funding/?marketplace=${this.marketplace_id}`)
            this.users = this.api.get('users/')
        });
    }

    filterOrders(){
        let url = `funding/?marketplace=${this.marketplace_id}` ;

        if(this.filter.date){
            // @ts-ignore
            url = url + `&date=${this.filter.date.year}-${this.filter.date.month}-${this.filter.date.day}` ;
        }

        if(this.filter.users.length > 0){
            url = url + `&user__in=${this.filter.users.map(u => u.id).join(",") }` ;
        }

        if(this.filter.status.length > 0){
            url = url + `&status__in=${this.filter.status.map(s => s.value).join(",")}` ;
        }

        this.fundings = this.api.get(url);
    }

    updateStatus(funding, status){
        funding.activity = "upload" ;
        funding.status = status.value ;

        this.api.patch(`funding/${funding.id}/`, {
            status: funding.status
        }).subscribe(
            _ => {
                funding.activity = "check" ;
                setTimeout(() => funding.activity = false, 1000)
            },
            err => this.error = err.message
        )
    }

    countItems() {
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace)
    }

}
