import { ShortTag } from "../tag";

export interface Doctor {
  id: string;
  name: string;
  address: string;
  phone: string;
  fee?: Number;
  tags: ShortTag[];
}
