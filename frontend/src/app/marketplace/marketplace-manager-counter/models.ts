export interface RawProduct {
    id: number,
    marketplace: string,
    name: string,
    number_left: number,
    orderable_online: boolean,
    price: string,
    still_in_the_catalogue: boolean,
}

export class Product {
    id: number;
    marketplace: string;
    name: string;
    number_left: number;
    orderable_online: boolean;
    price: number;
    still_in_the_catalogue: boolean;

    constructor(rawProduct: RawProduct) {
        this.id = rawProduct.id;
        this.marketplace = rawProduct.marketplace;
        this.name = rawProduct.name;
        this.number_left = rawProduct.number_left;
        this.orderable_online = rawProduct.orderable_online;
        this.price = Number(rawProduct.price);
        this.still_in_the_catalogue = rawProduct.still_in_the_catalogue;
    }

}

export class BasketItem {
    product: Product;
    quantity: number;

    constructor (product: Product, quantity: number = 1) {
        this.product = product;
        this.quantity = quantity;
    }
}