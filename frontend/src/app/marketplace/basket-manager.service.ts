import { Injectable } from '@angular/core';

import { Basket, Marketplace, Product } from './models';

@Injectable({ providedIn: 'root' })
export class BasketManagerService {
    private basket: Basket;

    load(): Basket {
        this.basket = JSON.parse(sessionStorage.getItem("basket")) || {};

        return this.basket ;
    }

    setQuantity(basket: Basket, marketplace: Marketplace, product: Product, quantity: number): void {
        if (quantity < 0) {
            this.setQuantity(basket, marketplace, product, 0);
        }

        if (quantity === 0 && basket[marketplace.id] != undefined && basket[marketplace.id][product.id] != undefined) {
            delete basket[marketplace.id][product.id];

            if (Object.entries(basket[marketplace.id]).length === 0) {
                delete basket[marketplace.id];
            }
        } else {
            if(basket[marketplace.id] == undefined){
                basket[marketplace.id] = {};
            }

            basket[marketplace.id][product.id] = quantity;
        }

        this.save(basket)
    }

    getQuantity(basket: Basket, marketplace: Marketplace, product: Product): number {
        if (basket[marketplace.id] == undefined || basket[marketplace.id][product.id] == undefined) {
            return 0;
        } else {
            return basket[marketplace.id][product.id];
        }

    }

    clear(basket: Basket, marketplace: Marketplace): void {
        delete basket[marketplace.id];
        this.save(basket)
    }

    add(basket: Basket, marketplace: Marketplace, product: Product): void {
        const quantity = this.getQuantity(basket, marketplace, product) + 1;
        this.setQuantity(basket, marketplace, product, quantity);
    }

    remove(basket: Basket, marketplace: Marketplace, product: Product): void {
        const quantity = this.getQuantity(basket, marketplace, product) - 1;

        if (quantity >= 0) {
            this.setQuantity(basket, marketplace, product, quantity);
        }
    }

    save(basket: Basket): void {
        sessionStorage.setItem("basket", JSON.stringify(basket));
    }

    countItems(basket: Basket, marketplace: Marketplace): number{
        let count = 0;

        for(let index in basket[marketplace.id]){
            const productId = Number(index);
            count += Number(basket[marketplace.id][productId]);
        }

        return count;
    }

    // This function is broken
    getProducts(basket, marketplace) {
        throw new Error('Not implemented');
        let res = [] ;
        
        // This doesn't work, as basket[marketplace] is not iterable
        for (let product of basket[marketplace]){
            res.push({
                quantity: this.getQuantity(basket, marketplace, product), // product would not be of the right type
                product: product
            })
        }

        return res ;
    }
}
