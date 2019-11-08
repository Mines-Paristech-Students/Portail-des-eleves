import { Tag } from "../tag";
import { Association } from "./association";

export interface Media {
    id: string;
    uploaded_on: Date;
    uploaded_by: Date;
    file: string;
    tags: Tag[];
    name: string;
    description: string;
    association: Association;
}
