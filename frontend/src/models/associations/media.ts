import { Tag } from "../tags/tag";
import { Association } from "./association";

export class Media {
    id: string;
    uploaded_on: Date;
    uploaded_by: Date;
    file: string;
    tags: Tag[];
    name: string;
    description: string;
    association: Association;
}
