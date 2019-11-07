import {Namespace} from "./namespace";

export class Tag {
    constructor(public id: string,
                public value: string,
                public namespace: Namespace,) {

    }
}
