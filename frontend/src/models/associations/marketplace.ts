import { Association } from "./association";
import { Tag } from "../tag";

export interface Marketplace {
    id: string;
    enabled: boolean;
    association: Association;
    products: Product[];
}

export interface Product {
    id: string;
    tags: Tag[];
    name: string;
    description: string;
    price: number;
    comment: string;
    marketplace: Marketplace;
    number_left: number;
}
