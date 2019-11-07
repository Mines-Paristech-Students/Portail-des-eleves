import {Association} from "./association";
import {Product} from "./product";

export interface Marketplace {
    id: string;
    enabled: boolean;
    association: Association;
    products: Product[];
}
