import { ShortTag } from "../tag";
import { DoctorOpinion } from "./doctorOpinion";

export interface Doctor {
  id: string;
  name: string;
  address: string;
  phone: string;
  fee?: Number;
  tags: ShortTag[];
  opinions: DoctorOpinion[];
}
