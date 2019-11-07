import {Association} from "./association";
import {Product} from "./product";

export class Marketplace {
    constructor(public id: string,
                public enabled: boolean,
                public association: Association,
                public products: Product[]) {

    }
}
