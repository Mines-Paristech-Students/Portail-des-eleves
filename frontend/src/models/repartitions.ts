import { User } from "./user";

export enum CampaignStatus {
  Closed = "CLOSED",
  Open = "OPEN",
  Results = "RESULTS",
  Creating = "CREATING"
  }

export interface Repartition {
  id: string;
  name: string;
  manager?: User;
  status: CampaignStatus;
  groupsNumber: number;
  studentsNumber: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Proposition {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  proposition: Proposition;
  repartition: Repartition;
  users: User[];
}

export interface Wish {
  proposition: string;
  rank: number;
}

export interface UserCampaign {
  user: User;
  category: Category;
  fixedTo: Proposition;
}