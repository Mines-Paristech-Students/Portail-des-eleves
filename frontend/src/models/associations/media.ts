import { Tag } from "../tag";
import { Association } from "./association";

export interface Media {
    id: string;
    uploadedOn: Date;
    uploadedBy: Date;
    file: string;
    tags: Tag[];
    name: string;
    description: string;
    association: Association;
}
