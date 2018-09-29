import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasketManagerServiceService {

    load() {
        let basket = JSON.parse(sessionStorage.getItem("basket"));

        if(basket == null){
            basket = {}
        }

        return basket ;
    }

    setQuantity(basket, marketplace, product, quantity){

        if(quantity < 0){
            this.setQuantity(basket, marketplace, product, 0)
        }

        marketplace = marketplace.id ;
        product = product.id ;

        if(quantity == 0 && basket[marketplace] != undefined && basket[marketplace][product] != undefined){
            delete basket[marketplace][product] ;

            if(basket[marketplace].length == 0){
                delete basket[marketplace] ;
            }
        } else {
            if(basket[marketplace] == undefined){
                basket[marketplace] = {}
            }

            basket[marketplace][product] = quantity ;
        }

        this.save(basket)
    }

    getQuantity(basket, marketplace, product){

        marketplace = marketplace.id ;
        product = product.id ;

        if(basket[marketplace] == undefined || basket[marketplace][product] == undefined){
            return 0 ;
        } else {
            return basket[marketplace][product]
        }

    }

    clear(basket, marketplace){
        marketplace = marketplace.id ;

        delete basket[marketplace] ;
        this.save(basket)
    }

    add(basket, marketplace, product){

        this.setQuantity(
            basket, marketplace, product,
            this.getQuantity(basket, marketplace, product) + 1
        );
    }

    remove(basket, marketplace, product){

        var quantity = this.getQuantity(basket, marketplace, product) - 1 ;

        if(quantity >= 0) {
            this.setQuantity(
                basket, marketplace, product,
                quantity
            );
        }
    }

    save(basket){
        sessionStorage.setItem("basket", JSON.stringify(basket)) ;
    }

    countItems(basket, marketplace){
        marketplace = marketplace.id ;
        let S = 0;

        for(let k in basket[marketplace]){
            S += parseInt(basket[marketplace][k]) ;
        }

        return S ;
    }

    getProducts(basket, marketplace) {
        let res = [] ;
        
        for (let product of basket[marketplace]){
            res.push({
                quantity: this.getQuantity(basket, marketplace, product),
                product: product
            })
        }

        return res ;
    }
}
