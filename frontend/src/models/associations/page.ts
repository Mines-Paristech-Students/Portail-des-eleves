import { Tag } from "../tag";
import { User } from "../user";
import { Association } from "./association";

export interface Page {
  id?: string;
  authors: User[];
  creationDate: Date;
  lastUpdateDate: Date;
  tags: Tag[];
  association: Association;
  title: string;
  text: string;
  pageType: "NEWS" | "STATIC";
}
