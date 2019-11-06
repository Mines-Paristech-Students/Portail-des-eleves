import {Association} from "./";
import {Product} from "./product";

export class Marketplace {
    id: string;
    enabled: boolean;
    association: Association;
    products: [Product];
}