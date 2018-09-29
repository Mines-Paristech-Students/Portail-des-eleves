import {Component} from '@angular/core';
import {BaseMarketplaceComponent} from "../base-marketplace-component";
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {BasketManagerServiceService} from "../basketManager.service";

@Component({
    selector: 'app-marketplace-counter',
    templateUrl: './marketplace-manager-counter.component.html',
    styleUrls: ['./marketplace-manager-counter.component.scss']
})
export class MarketplaceManagerCounterComponent extends BaseMarketplaceComponent {

    users$: any;
    products$: any ;

    userSearch = "" ;
    productSearch = "" ;

    buyer: any = {id: "17bocquet"} ;
    userBasket = {} ;
    numberOfBuyerItems = 0 ;

    moneyToAdd: any ;
    addMoneyMessage = "";
    addMoneyStatus = "" ;

    constructor(api: ApiService, route: ActivatedRoute, manager: BasketManagerServiceService) {
        super(api, route, manager);
    }

    ngOnInit() {
        this.route.params.subscribe(
        (params) => {
            let id = params['id'];

            this.api.get(`rest/marketplace/${id}/`).subscribe(
                marketplace => {
                    this.marketplace = marketplace;
                    this.countItems();
                    this.updateProductSearch();
                },
                error => this.error = error.message
            );

        });

        this.updateUserSearch();
    }

    updateUserSearch(){
        this.users$ = this.api.get(`rest/users/?search=${this.userSearch}`)
    }

    updateProductSearch(){
        this.products$ = this.api.get(`rest/products/?marketplace=${this.marketplace.id}&search=${this.productSearch}`)
    }

    getQuantity(product){
        if(this.userBasket[product.id] == undefined){
            return 0 ;
        } else {
            return this.userBasket[product.id];
        }
    }

    setQuantity(product, value){
        this.userBasket[product.id] = value ;
        this.countBuyerItems();
    }

    inBasket() {
        return this.marketplace.products.filter(product => product.id in this.userBasket);
    }

    countBuyerItems(){
        this.numberOfBuyerItems = this.marketplace.products.reduce((acc, product) => acc + this.getQuantity(product), 0);
    }

    add(product){
        if(this.userBasket[product.id] != undefined){
            this.userBasket[product.id] += 1 ;
        } else {
            this.userBasket[product.id] = 1 ;
        }

        this.countBuyerItems();
    }

    remove(product){
        if(this.userBasket[product.id] != undefined && this.userBasket[product.id] > 0){
            this.userBasket[product.id] -= 1 ;
        }

        if(this.userBasket[product.id] == 0){
            delete this.userBasket[product.id];
        }

        this.countBuyerItems();
    }

    order(){
        let basket = [] ;
        for(let id in this.userBasket){
            basket.push({id: id, quantity: this.userBasket[id]});
        }

        this.api.post("rest/orders/", {
            products: basket,
            user: this.buyer.id
        }).subscribe(
            res => {
                this.userBasket = {} ;
                this.buyer = null ;
                this.countItems();
            },
            err => {this.error = err.message ; }

        )
    }

    addMoney(){
        this.api.put(`rest/marketplace/${this.marketplace.id}/balance`, {
            amount: parseFloat(this.moneyToAdd),
            user: this.buyer.id
        }).subscribe(
            res => {
                this.addMoneyMessage = `${this.moneyToAdd}€ ajoutés`;
                this.addMoneyStatus  = "success" ;
                this.moneyToAdd = "" ;

                //setTimeout(_ => this.addMoneyMessage = "", 3000);
            },
            err => {
                this.addMoneyMessage = err.message;
                this.addMoneyStatus  = "error" ;
            }
        )
    }
}
