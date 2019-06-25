export interface RawProduct {
    id: number,
    marketplace: string,
    name: string,
    description: string,
    number_left: number,
    orderable_online: boolean,
    price: string,
    still_in_the_catalogue: boolean,
}

export class Product {
    id: number;
    marketplace: string;
    name: string;
    description: string;
    number_left: number;
    orderable_online: boolean;
    price: number;
    still_in_the_catalogue: boolean;

    constructor(rawProduct: RawProduct) {
        this.id = rawProduct.id;
        this.marketplace = rawProduct.marketplace;
        this.name = rawProduct.name;
        this.description = rawProduct.description;
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

export type Basket = { [ marketplaceId: string ] : { [ productId: number ] : number } }

export interface RawAssociationShort {
    id: string,
    logo: string,
    name: string,
}

export class AssociationShort {
    id: string;
    logo: string;
    name: string;

    constructor(rawAssociationShort: RawAssociationShort) {
        this.id = rawAssociationShort.id;
        this.logo = rawAssociationShort.logo;
        this.name = rawAssociationShort.name;
    }
}

export interface RawMarketplace {
    id: string,
    enabled: boolean,
    association: RawAssociationShort,
    products: RawProduct[],
}

export class Marketplace {
    id: string;
    enabled: boolean;
    association: AssociationShort;
    products: Product[];

    constructor(rawMarketplace: RawMarketplace) {
        this.id = rawMarketplace.id;
        this.enabled = rawMarketplace.enabled;
        this.association = new AssociationShort(rawMarketplace.association);
        this.products = rawMarketplace.products.map(rawProduct => new Product(rawProduct));
    }
}