import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {ApiService} from "../../api.service";
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import { BasketManagerService } from "../basket-manager.service";
import { Marketplace, RawMarketplace } from './../models';

@Component({
    selector: 'app-marketplace-seller-pending',
    templateUrl: './marketplace-manager-orders.component.html',
    styleUrls: ['./marketplace-manager-orders.component.scss']
})
export class MarketplaceManagerOrdersComponent extends BaseMarketplaceComponent {

    orders: any;
    p = 1; // The current page

    marketplace_id: any ;

    filter = {
        date: "",
        status: [],
        users: []
    };

    users: any ;

    status = [
        {value: "ORDERED", label: "Commandé", color: "blue"},
        {value: "VALIDATED", label: "Validé", color: "lime"},
        {value: "DELIVERED", label: "Délivré", color: "green"},
        {value: "CANCELLED", label: "Annulé", color: "red"},
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

            this.orders = this.api.get(`orders/?product__marketplace=${this.marketplace_id}`);
            this.users = this.api.get('users/');
        });
    }

    filterOrders(){
        console.log("bip");
        let url = `orders/?product__marketplace=${this.marketplace_id}` ;

        if(this.filter.date){
            // @ts-ignore
            url = url + `&date=${this.filter.date.year}-${this.filter.date.month}-${this.filter.date.day}` ;
        }

        if(this.filter.users.length > 0){
            url = url + `&buyer__in=${this.filter.users.map(u => u.id).join(",") }` ;
        }

        if(this.filter.status.length > 0){
            url = url + `&status__in=${this.filter.status.map(s => s.value).join(",")}` ;
        }

        console.log(url);
        this.orders = this.api.get(url);
    }

    updateStatus(order, status){
        order.activity = "upload" ;
        order.status = status.value ;

        this.api.patch(`orders/${order.id}/`, {
            status: order.status
        }).subscribe(
            _ => {
                order.activity = "check" ;
                setTimeout(() => order.activity = false, 1000)
            },
            err => this.error = err.message
        )
    }

    countItems() {
        this.numberOfItems = this.manager.countItems(this.basket, this.marketplace)
    }

}
