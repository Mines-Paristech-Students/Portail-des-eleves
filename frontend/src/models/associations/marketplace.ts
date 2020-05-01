import { Association } from "./association";
import { Tag } from "../tag";
import { User } from "../user";

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
    numberLeft: number;
}

export enum TransactionStatus {
    Ordered = "ORDERED",
    Cancelled = "CANCELLED",
    Rejected = "REJECTED",
    Validated = "VALIDATED",
    Delivered = "DELIVERED",
    Refunded = "REFUNDED"
}

export interface Transaction {
    id: string;
    product: Product;
    buyer: User;
    quantity: number;
    value: number;
    date: Date;
    status: TransactionStatus;
    marketplace: Marketplace;
}
